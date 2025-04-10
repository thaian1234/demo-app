import { IsNumberString, IsUUID, Length } from "class-validator";

export class VerifyEmailDto {
    @IsUUID()
    userId!: string;

    @IsNumberString()
    @Length(8, 8, { message: "Code must be 8 digits" })
    code!: string;
}
