import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

import { TimeSpan, createDate } from "oslo";
import { isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

@Injectable()
export class EmailVerificationService {
    constructor(private readonly prisma: PrismaService) {}

    async generateEmailVerificationCode(userId: string) {
        await this.deleteAllEmailVerificationCodes(userId);
        const code = generateRandomString(8, alphabet("0-9"));
        const createdCode = await this.prisma.emailVerificationCode.create({
            data: {
                userId,
                code,
                expiredAt: createDate(new TimeSpan(15, "m")),
            },
        });
        return createdCode.code;
    }

    async verifyCode(userId: string, code: string) {
        return this.prisma.$transaction(async db => {
            const dbCode = await db.emailVerificationCode.findFirst({
                where: {
                    userId,
                },
            });

            if (!dbCode || dbCode.code !== code) return false;
            if (!isWithinExpirationDate(dbCode.expiredAt)) {
                await this.deleteAllEmailVerificationCodes(userId);
                return false;
            }
            await this.deleteAllEmailVerificationCodes(userId);
            return true;
        });
    }

    async deleteAllEmailVerificationCodes(userId: string) {
        return this.prisma.emailVerificationCode.deleteMany({
            where: {
                userId,
            },
        });
    }
}
