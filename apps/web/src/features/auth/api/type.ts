import { User } from "@/types/common";
import { z } from "zod";

const passwordValidation = {
    noSpaces: /^[^\s]+$/,
};
const usernameValidation = {
    startsWithLetter: /^[a-zA-Z]/,
    validCharacters: /^[a-zA-Z0-9_]+$/, // Only letters, numbers, underscores allowed
    endsWithLetterOrNumber: /[a-zA-Z0-9]$/, // Must end with letter or number
    noSpaces: /^[^\s]+$/,
};

const usernameSchema = z
    .string()
    .min(4, "Must be at least 4 characters")
    .max(16, "Must be at most 16 characters")
    .regex(usernameValidation.startsWithLetter, "Must start with a letter")
    .regex(usernameValidation.endsWithLetterOrNumber, "Must end with a letter or number")
    .regex(usernameValidation.validCharacters, "Can only contain letters, numbers, and underscores")
    .regex(usernameValidation.noSpaces, "Username cannot contain spaces");

const passwordSchema = z
    .string()
    .min(8, "Must be at least 8 characters")
    .max(32, "Must be at most 32 characters")
    .regex(passwordValidation.noSpaces, "Password cannot contain spaces");

// Schemas
export const authRequestSchema = {
    signin: z.object({
        email: z.string().email(),
        password: passwordSchema,
    }),
    signup: z.object({
        email: z.string().email(),
        username: usernameSchema,
        password: passwordSchema,
    }),
    requestResetPassword: z.object({
        email: z.string().email(),
    }),
    verifyResetPassword: z.object({
        newPassword: passwordSchema,
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
type ResetPasswordRequest = z.infer<typeof authRequestSchema.requestResetPassword>;
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
