import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { SignUpDto } from './auth/dto/sign-up.dto';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { SignInDto } from './auth/dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('signin')
    signin(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }
}
