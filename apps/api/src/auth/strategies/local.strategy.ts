import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { authConstants } from "../auth.constants";
import { REGEX } from "src/utils/helpers/regex";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "email",
            passwordField: "password",
        });
    }

    async validate(email: string, password: string): Promise<any> {
        this.validateInput(email, password);
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException(authConstants.error.invalidCredentials);
        }
        if (user.emailVerified === false) {
            throw new UnauthorizedException(authConstants.error.emailNotVerified);
        }
        return user;
    }

    validateInput(email: string, password: string): void {
        if (!REGEX.noSpaces.test(password) || !REGEX.endsWithLetterOrNumber.test(password)) {
            throw new BadRequestException(
                "Password must not contain spaces and must end with a letter or number",
            );
        }
        if (!REGEX.validEmail.test(email)) {
            throw new BadRequestException("Invalid email address");
        }
    }
}
