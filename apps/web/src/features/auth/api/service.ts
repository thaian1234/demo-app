import {
    ProfileResponse,
    ResetPasswordRequest,
    SigninRequest,
    SigninResponse,
    SignupRequest,
    SignupResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
    VerifyResetPasswordRequest,
} from "./type";
import axiosRequest from "@/lib/axios-request";
import { RequestMethod } from "@/enums/request-method";

class AuthService {
    private readonly endpoints = {
        signin: "/auth/signin",
        signout: "/auth/signout",
        signup: "/auth/signup",
        profile: "/auth/profile",
        verifyEmai: "/auth/verify-email",
        requestResetPassword: "/auth/reset-password",
        verifyResetPassword: "/auth/reset-password/verify",
    };

    async signin(data: SigninRequest) {
        return axiosRequest<SigninResponse>({
            method: RequestMethod.POST,
            url: this.endpoints.signin,
            data,
        });
    }
    async signout() {
        return axiosRequest({
            method: RequestMethod.POST,
            url: this.endpoints.signout,
        });
    }
    async signup(data: SignupRequest) {
        return axiosRequest<SignupResponse>({
            method: RequestMethod.POST,
            url: this.endpoints.signup,
            data,
        });
    }
    async getProfile() {
        return axiosRequest<ProfileResponse>({
            method: RequestMethod.GET,
            url: this.endpoints.profile,
        });
    }
    async verifyEmail(data: VerifyEmailRequest) {
        return axiosRequest<VerifyEmailResponse>({
            method: RequestMethod.POST,
            url: this.endpoints.verifyEmai,
            data,
        });
    }
    async requestResetPassword(data: ResetPasswordRequest) {
        return axiosRequest({
            method: RequestMethod.POST,
            url: this.endpoints.requestResetPassword,
            data,
        });
    }
    async verifyResetPassword(data: VerifyResetPasswordRequest) {
        return axiosRequest({
            method: RequestMethod.POST,
            url: this.endpoints.verifyResetPassword,
            data,
        });
    }
}

export const authService = new AuthService();
