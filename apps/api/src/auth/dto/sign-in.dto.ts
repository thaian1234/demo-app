import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { REGEX } from "src/utils/helpers/regex";

export class SignInDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(REGEX.noSpaces, { message: "Password cannot contain spaces" })
    password!: string;
}
