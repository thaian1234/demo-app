import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { REGEX } from "src/utils/helpers/regex";

export declare class VerifyResetPasswordDto {
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(REGEX.noSpaces, { message: "Password cannot contain spaces" })
    newPassword: string;

    @IsNotEmpty()
    token: string;
}
