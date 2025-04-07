import { JwtPayload } from "src/auth/dto/jwt-payload.dto";

export type AuthRequest = Request & { user: JwtPayload };
