import { z } from "zod";
import { authRequestSchema } from "./type";
import axiosRequest from "@/lib/axios-request";
import { RequestMethod } from "@/enums/request-method";

class AuthService {
    private readonly endpoints = {
        signin: "/auth/signin",
        signout: "/auth/signout",
        signup: "/auth/signup",
        profile: "/auth/profile",
    };

    async login(data: z.infer<typeof authRequestSchema.signin>) {
        const response = await axiosRequest({
            method: RequestMethod.POST,
            url: this.endpoints.signin,
            data,
        });
        return response.data;
    }
    async getProfile() {
        const response = await axiosRequest({
            method: RequestMethod.GET,
            url: this.endpoints.profile,
        });
        return response.data;
    }
}

export const authService = new AuthService();
