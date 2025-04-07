import {
    ProfileResponse,
    SigninRequest,
    SigninResponse,
    SignupRequest,
    SignupResponse,
} from "./type";
import axiosRequest from "@/lib/axios-request";
import { RequestMethod } from "@/enums/request-method";

class AuthService {
    private readonly endpoints = {
        signin: "/auth/signin",
        signout: "/auth/signout",
        signup: "/auth/signup",
        profile: "/auth/profile",
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
}

export const authService = new AuthService();
