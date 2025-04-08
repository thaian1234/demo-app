import * as bcrypt from "bcrypt";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

import { authConstants } from "./auth.constants";

import { JwtPayload } from "./dto/jwt-payload.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { EmailVerificationService } from "src/email-verification/email-verification.service";
import { NodemailService } from "src/nodemail/nodemail.service";

@Injectable()
export class AuthService {
    private tokenBlacklist: Set<string> = new Set();

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly emailVerificationService: EmailVerificationService,
        private readonly nodeMailerService: NodemailService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findUser({
            where: {
                email,
            },
        });

        if (user && bcrypt.compareSync(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async signUp(signUpDto: SignUpDto) {
        const existingUser = await this.userService.findUser({
            where: {
                email: signUpDto.email,
            },
        });

        if (existingUser?.emailVerified) {
            throw new BadRequestException(authConstants.error.existingUser);
        }
        if (existingUser && !existingUser.emailVerified) {
            throw new UnauthorizedException(authConstants.error.emailNotVerified);
        }

        const hashedPassword = bcrypt.hashSync(signUpDto.password, 10);
        const user = await this.userService.createUser({
            data: {
                email: signUpDto.email,
                username: signUpDto.username,
                password: hashedPassword,
            },
        });

        if (!user) {
            throw new BadRequestException(authConstants.error.userNotCreated);
        }

        const code = await this.emailVerificationService.generateEmailVerificationCode(user.id);
        await this.nodeMailerService.sendVerifcationEmailCode(code, user.email);

        return {
            userId: user.id,
        };
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.validateUser(signInDto.email, signInDto.password);

        if (!user) {
            throw new BadRequestException(authConstants.error.invalidCredentials);
        }

        const accessToken = await this.generateToken({
            userId: user.id,
        });

        return {
            accessToken,
            user,
        };
    }

    async signOut(userId: string, token: string) {
        const user = await this.userService.findUser({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new BadRequestException(authConstants.error.userNotFound);
        }
        this.tokenBlacklist.add(token);

        return {
            message: authConstants.success.logoutSuccess,
        };
    }

    async verifyEmail(userId: string, code: string) {
        const user = await this.userService.findUser({
            where: {
                id: userId,
                emailVerified: false,
            },
        });
        if (!user) {
            throw new BadRequestException(authConstants.error.userNotFound);
        }

        const isCodeValid = await this.emailVerificationService.verifyCode(user.id, code);
        if (!isCodeValid) {
            throw new BadRequestException(authConstants.error.invalidCode);
        }

        await this.userService.updateUser({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: true,
            },
        });

        const accessToken = await this.generateToken({
            userId: user.id,
        });

        return {
            accessToken,
        };
    }

    async generateToken(jwtPayload: JwtPayload) {
        const accessToken = await this.jwtService.signAsync(jwtPayload);
        return accessToken;
    }

    public isTokenBlacklisted(token: string): boolean {
        return this.tokenBlacklist.has(token);
    }
}
