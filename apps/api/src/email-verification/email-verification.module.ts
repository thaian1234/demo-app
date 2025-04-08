import { PrismaService } from "src/prisma/prisma.service";
import { EmailVerificationService } from "./email-verification.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [],
    providers: [EmailVerificationService, PrismaService],
    exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
