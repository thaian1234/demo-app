import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { TokenExpiredError } from "@nestjs/jwt";
import { errorCodeConstants } from "src/utils/constants/error-code.constant";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private authService: AuthService) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("Invalid token");
        }

        const isTokenBlacklisted = this.authService.isTokenBlacklisted(token);
        if (isTokenBlacklisted) {
            throw new UnauthorizedException("Token has been revoked");
        }

        return super.canActivate(context);
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }

    handleRequest<TUser = any>(
        err: any,
        user: TUser,
        info: any,
        context: ExecutionContext,
        status?: any,
    ): TUser {
        if (info instanceof TokenExpiredError) {
            throw new UnauthorizedException({
                code: errorCodeConstants.TOKEN_EXPIRED,
                success: false,
                message: "Token has expired",
                statusCode: HttpStatus.UNAUTHORIZED,
            });
        }
        if (err || !user) {
            throw err || new UnauthorizedException("Unauthorized");
        }
        return user;
    }
}
