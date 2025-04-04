import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { authConstants } from './auth.constants';
import { JwtPayload } from './dto/jwt-payload.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user && bcrypt.compareSync(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async signUp(signUpDto: SignUpDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: signUpDto.email },
        });

        if (existingUser) {
            throw new BadRequestException(authConstants.error.existingUser);
        }

        const hashedPassword = bcrypt.hashSync(signUpDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: signUpDto.email,
                username: signUpDto.username,
                password: hashedPassword,
            },
        });

        if (!user) {
            throw new BadRequestException(authConstants.error.userNotCreated);
        }

        const accessToken = await this.generateToken({
            email: user.email,
            username: user.username,
            userId: user.id,
        });

        return {
            message: authConstants.success.userCreated,
            accessToken,
        };
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.validateUser(signInDto.email, signInDto.password);

        if (!user) {
            throw new BadRequestException(authConstants.error.invalidCredentials);
        }

        const accessToken = await this.generateToken({
            email: user.email,
            username: user.username,
            userId: user.id,
        });

        return {
            message: authConstants.success.loginSuccess,
            accessToken,
        };
    }

    async signOut(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException(authConstants.error.userNotFound);
        }

        return {
            message: authConstants.success.logoutSuccess,
        };
    }

    async generateToken(jwtPayload: JwtPayload) {
        const accessToken = await this.jwtService.signAsync(jwtPayload);
        return accessToken;
    }
}
