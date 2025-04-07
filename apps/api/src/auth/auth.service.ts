import * as bcrypt from "bcrypt";
import { BadRequestException, Injectable } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

import { authConstants } from "./auth.constants";

import { JwtPayload } from "./dto/jwt-payload.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
    private tokenBlacklist: Set<string> = new Set();

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
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

        if (existingUser) {
            throw new BadRequestException(authConstants.error.existingUser);
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

        const accessToken = await this.generateToken({
            userId: user.id,
        });

        return {
            accessToken,
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

    async generateToken(jwtPayload: JwtPayload) {
        const accessToken = await this.jwtService.signAsync(jwtPayload);
        return accessToken;
    }

    public isTokenBlacklisted(token: string): boolean {
        return this.tokenBlacklist.has(token);
    }
}
