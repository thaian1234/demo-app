import { User } from "@/types/common";
import { z } from "zod";

// Schemas
export const authRequestSchema = {
    signin: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    }),
    signup: z.object({
        email: z.string().email(),
        username: z.string().min(4),
        password: z.string().min(8),
    }),
    resetPassword: z.object({
        email: z.string().email(),
    }),
};

// Request type
type SigninRequest = z.infer<typeof authRequestSchema.signin>;
type SignupRequest = z.infer<typeof authRequestSchema.signup>;
type ResetPasswordRequest = z.infer<typeof authRequestSchema.resetPassword>;

// Response type
type SigninResponse = User & {
    accessToken: string;
};
type SignupResponse = {
    accessToken: string;
};
type ProfileResponse = User;

export type {
    SigninResponse,
    SignupResponse,
    ProfileResponse,
    SigninRequest,
    SignupRequest,
    ResetPasswordRequest,
};
