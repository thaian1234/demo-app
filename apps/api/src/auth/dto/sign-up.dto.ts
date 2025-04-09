import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
import { REGEX } from "src/utils/helpers/regex";
export class SignUpDto {
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    username!: string;

    @MinLength(8)
    @MaxLength(32)
    @IsString()
    @Matches(REGEX.noSpaces, { message: "Password cannot contain spaces" })
    password!: string;
}
