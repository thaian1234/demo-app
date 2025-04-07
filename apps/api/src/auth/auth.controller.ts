import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignInDto } from "./dto/sign-in.dto";
import { ResponseMessage } from "../utils/decorators/response-message.decorator";
import { authConstants } from "./auth.constants";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthRequest } from "src/utils/types/auth-request.type";

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
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    signout(@Req() req: AuthRequest, @Headers("Authorization") authorization: string) {
        const token = this.extractTokenFromHeader(authorization);
        if (!token) {
            throw new UnauthorizedException("No token provided");
        }
        return this.authService.signOut(req.user.userId, token);
    }

    private extractTokenFromHeader(authorization: string): string | undefined {
        const [type, token] = authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }

    // TODO: Query user from Database
    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Req() req: AuthRequest) {
        return {
            user: req.user,
        };
    }
}
