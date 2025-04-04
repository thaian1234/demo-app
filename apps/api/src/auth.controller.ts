import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { SignUpDto } from './auth/dto/sign-up.dto';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SignInDto } from './auth/dto/sign-in.dto';
import { ResponseMessage } from './utils/decorators/response-message.decorator';
import { authConstants } from './auth/auth.constants';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ResponseMessage(authConstants.success.userCreated)
    signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @UseGuards(LocalAuthGuard)
    @ResponseMessage(authConstants.success.loginSuccess)
    @Post('signin')
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: Request & { user: Omit<User, 'password'> }) {
        return {
            user: req.user,
        };
    }
}
