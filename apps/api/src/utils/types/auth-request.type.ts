import { User } from "@prisma/client";

export type AuthRequest = Request & { user: Omit<User, "password"> };
