import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";

import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";

import { ResponseMessage } from "../utils/decorators/response-message.decorator";
import { AuthRequest } from "src/utils/types/auth-request.type";

import { authConstants } from "./auth.constants";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { RequestPasswordResetDto } from "./dto/request-password-reset.dto";
import { VerifyResetPasswordDto } from "./dto/verify-reset-password.dto";
import { PasswordResetService } from "src/password-reset/password-reset.service";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly passwordResetService: PasswordResetService,
    ) {}

    @Post("signup")
    @ResponseMessage(authConstants.success.emailVerificationCodeSent)
    signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @UseGuards(LocalAuthGuard)
    @ResponseMessage(authConstants.success.loginSuccess)
    @Post("signin")
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @Post("signout")
    @ResponseMessage(authConstants.success.logoutSuccess)
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    signout(@Req() req: AuthRequest, @Headers("Authorization") authorization: string) {
        const token = this.extractTokenFromHeader(authorization);
        if (!token) {
            throw new UnauthorizedException("No token provided");
        }
        return this.authService.signOut(req.user.userId, token);
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: AuthRequest) {
        return this.userService.findUser({
            where: {
                id: req.user.userId,
            },
            omit: {
                password: true,
            },
        });
    }

    @Post("verify-email")
    @ResponseMessage(authConstants.success.emailVerified)
    @HttpCode(HttpStatus.OK)
    verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto.userId, verifyEmailDto.code);
    }

    @Post("password-reset")
    @ResponseMessage(authConstants.success.passwordResetEmailSent)
    sendForgotPasswordLink(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
        return this.authService.requestResetPassword(requestPasswordResetDto.email);
    }

    @Post("password-reset/verify")
    @ResponseMessage(authConstants.success.passwordResetSuccess)
    @HttpCode(HttpStatus.OK)
    verifyPasswordResetToken(@Body() passwordResetTokenDto: VerifyResetPasswordDto) {
        console.log({
            passwordResetTokenDto,
        });
        return this.passwordResetService.resetPassword(
            passwordResetTokenDto.token,
            passwordResetTokenDto.newPassword,
        );
    }
    private extractTokenFromHeader(authorization: string): string | undefined {
        const [type, token] = authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
