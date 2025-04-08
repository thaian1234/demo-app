import * as nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

@Injectable()
export class NodemailService implements OnModuleInit {
    private logger = new Logger(NodemailService.name);
    private transporter!: nodemailer.Transporter<
        SMTPTransport.SentMessageInfo,
        SMTPTransport.Options
    >;
    private readonly fromName: string;
    private readonly fromEmail: string;

    constructor(private readonly configService: ConfigService) {
        this.fromName = "Demo Application";
        this.fromEmail = this.configService.getOrThrow<string>("SMTP_USER");
    }

    async onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow<string>("SMTP_HOST"),
            port: parseInt(this.configService.getOrThrow<string>("SMTP_PORT"), 10),
            secure: this.configService.get<boolean>("SMTP_SECURE", false),
            auth: {
                user: this.fromEmail,
                pass: this.configService.getOrThrow<string>("SMTP_PASS"),
            },
        } as SMTPTransport.MailOptions);

        try {
            await this.transporter.verify();
        } catch (error) {
            this.logger.error("Error connecting to SMTP server", error);
        }
    }

    private createEmailConfig(subject: string, message: string, toEmail: string): Mail.Options {
        return {
            subject: subject,
            from: {
                name: this.fromName,
                address: this.fromEmail,
            },
            to: toEmail,
            text: message,
            html: message,
        };
    }
    public async sendVerifcationEmailCode(code: string, toEmail: string) {
        try {
            const options = this.createEmailConfig("Verification Code", code, toEmail);
            const { accepted, rejected } = await this.transporter.sendMail(options);
            if (rejected && rejected.length > 0) {
                this.logger.error("Some recipients were rejected", rejected);
            }
            return accepted && accepted.length > 0;
        } catch (error) {
            this.logger.error("Error sending password reset email", error);
            return false;
        }
    }
    public async sendPasswordResetEmail(resetUrl: string, toEmail: string) {
        try {
            const options = this.createEmailConfig("Password Reset", resetUrl, toEmail);
            const { accepted, rejected } = await this.transporter.sendMail(options);
            if (rejected && rejected.length > 0) {
                this.logger.error("Some recipients were rejected", rejected);
            }
            return accepted && accepted.length > 0;
        } catch (error) {
            this.logger.error("Error sending verification email", error);
            return false;
        }
    }
}
