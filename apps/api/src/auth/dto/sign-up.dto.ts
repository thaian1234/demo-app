import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";
export class SignUpDto {
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    username!: string;

    @MinLength(8)
    @IsString()
    password!: string;
}
