import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export declare class VerifyResetPasswordDto {
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    newPassword: string;
}
