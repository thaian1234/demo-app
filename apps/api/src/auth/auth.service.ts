import * as bcrypt from "bcrypt";
import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

import { authConstants } from "./auth.constants";

import { JwtPayload } from "./dto/jwt-payload.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { EmailVerificationService } from "src/email-verification/email-verification.service";
import { NodemailService } from "src/nodemail/nodemail.service";
import { PasswordResetService } from "src/password-reset/password-reset.service";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { ExecutionContext } from "src/utils/helpers/execution-context";

@Injectable()
export class AuthService {
    private tokenBlacklist: Set<string> = new Set();
    private logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly emailVerificationService: EmailVerificationService,
        private readonly passworddResetService: PasswordResetService,
        private readonly nodeMailerService: NodemailService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findUser({
            where: {
                email,
                emailVerified: true,
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
        ExecutionContext.waitUntil(
            this.nodeMailerService.sendVerifcationEmailCode(code, user.email).catch(error => {
                this.logger.error(error);
            }),
        );

        return {
            userId: user.id,
        };
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.validateUser(signInDto.email, signInDto.password);

        if (!user) {
            throw new BadRequestException(authConstants.error.invalidCredentials);
        }

        const accessToken = this.generateToken({
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

        const accessToken = this.generateToken({
            userId: user.id,
        });

        return {
            accessToken,
        };
    }

    async requestResetPassword(email: string) {
        const existingUser = await this.userService.findUser({
            where: {
                email,
            },
        });
        if (!existingUser) {
            throw new NotFoundException(authConstants.error.userNotFound);
        }
        const { resetUrl } = await this.passworddResetService.createPasswordResetToken(
            existingUser.id,
        );
        ExecutionContext.waitUntil(
            this.nodeMailerService
                .sendPasswordResetEmail(resetUrl, email)
                .then(() => {
                    this.logger.log("Password reset email sent successfully");
                })
                .catch(error => {
                    this.logger.error("Failed to send password reset email", error);
                }),
        );
    }

    generateToken(jwtPayload: JwtPayload) {
        const accessToken = this.jwtService.sign(jwtPayload);
        return accessToken;
    }

    public isTokenBlacklisted(token: string): boolean {
        return this.tokenBlacklist.has(token);
    }
}
