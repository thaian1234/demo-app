import { useMutation, useQuery } from "@tanstack/react-query";
import { SigninRequest, SignupRequest } from "./type";
import { authService } from "./service";
import { toast } from "sonner";

export const authApi = {
    query: {
        useGetProfile() {
            return useQuery({
                queryKey: ["profile"],
                queryFn: () => {
                    return authService.getProfile();
                },
            });
        },
    },
    mutation: {
        useSignin() {
            return useMutation({
                mutationFn: (input: SigninRequest) => {
                    return authService.signin(input);
                },
                onSuccess: ({ data, message }) => {
                    toast.success(message);
                    localStorage.setItem("access_token", data.accessToken);
                },
                onError: error => {
                    toast.error(error.message);
                    if (localStorage.getItem("access_token")) {
                        localStorage.removeItem("access_token");
                    }
                },
            });
        },
        useSignup() {
            return useMutation({
                mutationFn: (input: SignupRequest) => {
                    return authService.signup(input);
                },
                onSuccess: ({ data, message }) => {
                    toast.success(message);
                    localStorage.setItem("access_token", data.accessToken);
                },
                onError: error => {
                    toast.error(error.message);
                    if (localStorage.getItem("access_token")) {
                        localStorage.removeItem("access_token");
                    }
                },
            });
        },
    },
};
