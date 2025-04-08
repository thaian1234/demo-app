import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { authConstants } from "./auth.constants";
import { PrismaService } from "src/prisma/prisma.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "src/user/user.module";
import { EmailVerificationModule } from "src/email-verification/email-verification.module";
import { NodemailModule } from "src/nodemail/nodemail.module";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: authConstants.jwt.secret,
            signOptions: { expiresIn: authConstants.jwt.expiresIn, algorithm: "HS256" },
        }),
        UserModule,
        EmailVerificationModule,
        NodemailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
