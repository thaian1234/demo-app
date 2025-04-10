import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    InternalServerErrorException,
    BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal Server Error";
        let errors = null;

        // Handle HttpExceptions
        if (exception instanceof HttpException) {
            status = exception.getStatus();

            // Default message
            message =
                exception instanceof InternalServerErrorException
                    ? "Internal Server Error"
                    : exception.message;

            // Handle validation errors (BadRequestException with validation details)
            if (exception instanceof BadRequestException) {
                const exceptionResponse = exception.getResponse() as any;

                // Check if this is a validation error (has message array)
                if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
                    message = "Validation failed";
                    errors = exceptionResponse.message;
                }
            }
        }

        // Handle Prisma exceptions
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            this.logger.error(`Prisma error: ${exception.code}`, exception.stack);

            // Map common Prisma error codes to user-friendly messages
            switch (exception.code) {
                case "P2002":
                    status = HttpStatus.CONFLICT;
                    message = "A record with this information already exists";
                    break;
                case "P2025":
                    status = HttpStatus.NOT_FOUND;
                    message = "Record not found";
                    break;
                case "P2003":
                    status = HttpStatus.BAD_REQUEST;
                    message = "Foreign key constraint failed";
                    break;
                default:
                    status = HttpStatus.INTERNAL_SERVER_ERROR;
                    message = "Internal Server Error";
            }
        } else if (exception instanceof Prisma.PrismaClientValidationError) {
            this.logger.error("Prisma validation error", exception.stack);
            status = HttpStatus.BAD_REQUEST;
            message = "Invalid data provided";
        } else if (!(exception instanceof HttpException)) {
            // Log unknown errors
            this.logger.error(
                "Unexpected error",
                exception instanceof Error ? exception.stack : String(exception),
            );
        }

        // Log the request that caused the error
        this.logger.error(`${request.method} ${request.url}`, {
            body: request.body,
            query: { ...request.query },
            params: { ...request.params },
            statusCode: status,
        });

        response.status(status).json({
            success: false,
            statusCode: status,
            message: message,
            errors: errors || undefined,
            timestamp: new Date().toISOString(),
        });
    }
}
