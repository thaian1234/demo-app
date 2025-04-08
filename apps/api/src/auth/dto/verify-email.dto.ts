import { IsEmail, IsNumber, IsNumberString, Length } from "class-validator";

export class VerifyEmailDto {
    @IsEmail()
    email!: string;

    @IsNumberString()
    @Length(8, 8, { message: "Code must be 8 digits" })
    code!: string;
}
