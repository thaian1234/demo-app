import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "./service";
import { SigninRequest, SignupRequest } from "../type";
import { useNavigate } from "react-router-dom";

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
            const navigate = useNavigate();
            return useMutation({
                mutationFn: (input: SigninRequest) => {
                    return authService.signin(input);
                },
                onSuccess: ({ data, message }) => {
                    toast.success(message);
                    localStorage.setItem("access_token", data.accessToken);
                    navigate("/");
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
            const navigate = useNavigate();
            return useMutation({
                mutationFn: (input: SignupRequest) => {
                    return authService.signup(input);
                },
                onSuccess: ({ data, message }) => {
                    toast.success(message);
                    localStorage.setItem("access_token", data.accessToken);
                    navigate("/");
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
