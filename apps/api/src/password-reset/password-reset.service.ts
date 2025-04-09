import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";

import { ConfigService } from "@nestjs/config";
import { passwordResetConstants } from "./password-reset.constants";
import { PasswordResetToken } from "@prisma/client";

@Injectable()
export class PasswordResetService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {}
    async createPasswordResetToken(userId: string) {
        await this.deleteAllPasswordResetTokens(userId);
        const tokenId = this.generateTokenId();
        const hashedToken = this.hashToken(tokenId);

        const expiredAt = new Date();
        expiredAt.setMinutes(expiredAt.getMinutes() + 15);

        await this.prisma.passwordResetToken.create({
            data: {
                userId: userId,
                hashToken: hashedToken,
                expiredAt,
            },
        });
        const resetUrl = `${this.configService.get<string>("FRONTEND_URL", "http://localhost:5173")}/reset-password/${tokenId}`;
        return { resetUrl };
    }
    private async verifyToken(token: string): Promise<PasswordResetToken> {
        const hashedToken = this.hashToken(token);
        const passwordReset = await this.prisma.passwordResetToken.findFirst({
            where: {
                hashToken: hashedToken,
            },
        });
        if (!passwordReset) {
            throw new BadRequestException("Invalid or expired token");
        }
        const now = new Date();
        if (passwordReset.expiredAt < now) {
            await this.deleteAllPasswordResetTokens(passwordReset.userId);
            throw new BadRequestException(passwordResetConstants.error.tokenExpired);
        }
        return passwordReset;
    }
    async resetPassword(token: string, newPassword: string) {
        // Verify token and get userId
        const tokenRecord = await this.verifyToken(token);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: tokenRecord.userId },
            data: { password: hashedPassword },
        });

        await this.deleteAllPasswordResetTokens(tokenRecord.userId);
    }
    async deleteAllPasswordResetTokens(userId: string) {
        await this.prisma.passwordResetToken.deleteMany({
            where: {
                userId,
            },
        });
    }
    private generateTokenId(): string {
        // Generate a random 32-byte token and convert to hex
        return crypto.randomBytes(32).toString("hex");
    }

    private hashToken(tokenId: string) {
        // Create a SHA-256 hash of the token
        return crypto.createHash("sha256").update(tokenId).digest("hex");
    }
}
