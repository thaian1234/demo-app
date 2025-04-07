import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignInDto } from "./dto/sign-in.dto";
import { ResponseMessage } from "../utils/decorators/response-message.decorator";
import { authConstants } from "./auth.constants";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { User } from "@prisma/client";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    @ResponseMessage(authConstants.success.userCreated)
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
    signout(@Req() req: Request & { user: Omit<User, "password"> }) {
        return this.authService.signOut(req.user.id, req.user.email);
    }

    // TODO: Query user from Database
    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Req() req: Request & { user: Omit<User, "password"> }) {
        return {
            user: req.user,
        };
    }
}
