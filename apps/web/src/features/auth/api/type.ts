import { User } from "@/types/common";
import { z } from "zod";

// Schemas
export const authRequestSchema = {
    signin: z.object({
        email: z.string().email(),
        password: z.string().min(8).max(32),
    }),
    signup: z.object({
        email: z.string().email(),
        username: z.string().min(4),
        password: z.string().min(8).max(32),
    }),
    resetPassword: z.object({
        email: z.string().email(),
    }),
    verifyResetPassword: z.object({
        newPassword: z.string().min(8).max(32),
        token: z.string().nonempty(),
    }),
    verifyEmail: z.object({
        userId: z.string().uuid().optional(),
        code: z
            .string()
            .length(8, "Verify Code must be 8 characters long")
            .regex(/^\d+$/, "Verify Code must only contain numbers"),
    }),
};

// Request type
type SigninRequest = z.infer<typeof authRequestSchema.signin>;
type SignupRequest = z.infer<typeof authRequestSchema.signup>;
type ResetPasswordRequest = z.infer<typeof authRequestSchema.resetPassword>;
type VerifyEmailRequest = z.infer<typeof authRequestSchema.verifyEmail>;
type VerifyResetPasswordRequest = z.infer<typeof authRequestSchema.verifyResetPassword>;

// Response type
type SigninResponse = User & {
    accessToken: string;
};
type SignupResponse = {
    userId: string;
};
type ProfileResponse = User;
type VerifyEmailResponse = {
    accessToken: string;
};

export type {
    SigninResponse,
    SignupResponse,
    ProfileResponse,
    VerifyEmailResponse,
    SigninRequest,
    SignupRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    VerifyResetPasswordRequest,
};
