import { PrismaService } from "src/prisma/prisma.service";
import { PasswordResetService } from "./password-reset.service";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [],
    providers: [PasswordResetService, PrismaService, ConfigService],
    exports: [PasswordResetService],
})
export class PasswordResetModule {}
