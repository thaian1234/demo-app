import { PasswordResetModule } from "./password-reset/password-reset.module";
import { NodemailModule } from "./nodemail/nodemail.module";
import { EmailVerificationModule } from "./email-verification/email-verification.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./utils/configs/jwtConfig";

@Module({
    imports: [
        PasswordResetModule,
        NodemailModule,
        EmailVerificationModule,
        UserModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [jwtConfig],
        }),
    ],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
