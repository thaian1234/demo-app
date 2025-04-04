import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_METADATA } from '../decorators/response-message.decorator';

export type Response<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((res: unknown) => this.responseHandler(res, context)),
            catchError((err: HttpException) => throwError(() => this.errorHandler(err, context))),
        );
    }

    errorHandler(exception: HttpException, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = status === 500 ? 'Internal Server Error' : exception.message;

        response.status(status).json({
            success: false,
            statusCode: status,
            message: message,
        });
    }

    private responseHandler(res: any, context: ExecutionContext): Response<T> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        const message =
            this.reflector.get<string>(RESPONSE_MESSAGE_METADATA, context.getHandler()) ||
            'Success';

        return {
            success: true,
            statusCode,
            message: message,
            data: res,
        };
    }
}
