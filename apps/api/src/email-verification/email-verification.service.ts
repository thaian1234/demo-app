import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

import * as crypto from "crypto";

@Injectable()
export class EmailVerificationService {
    constructor(private readonly prisma: PrismaService) {}

    async generateEmailVerificationCode(userId: string) {
        await this.deleteAllEmailVerificationCodes(userId);
        const code = this.generateNumericCode(8);
        const expiredAt = new Date();
        expiredAt.setMinutes(expiredAt.getMinutes() + 15);

        const createdCode = await this.prisma.emailVerificationCode.create({
            data: {
                userId,
                code,
                expiredAt,
            },
        });
        return createdCode.code;
    }

    // Helper method to generate numeric codes
    private generateNumericCode(length: number): string {
        const bytes = crypto.randomBytes(length * 2);
        let result = "";
        for (let i = 0; i < bytes.length && result.length < length; i++) {
            // Convert byte to a digit (0-9)
            const digit = bytes[i] % 10;
            result += digit.toString();
        }
        return result.slice(0, length);
    }

    async verifyCode(userId: string, code: string) {
        return this.prisma.$transaction(async db => {
            const dbCode = await db.emailVerificationCode.findFirst({
                where: {
                    userId,
                },
            });
            const now = new Date();

            if (!dbCode || dbCode.code !== code) return false;
            if (now > dbCode.expiredAt) return false;

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
