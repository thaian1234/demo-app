import { z } from "zod";

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
