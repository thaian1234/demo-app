import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "./service";
import { useNavigate } from "react-router-dom";
import { SigninRequest, SignupRequest } from "./type";

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
        useSignout() {
            const navigate = useNavigate();
            const queryClient = useQueryClient();

            return useMutation({
                mutationFn: () => authService.signout(),
                onSuccess: () => {
                    toast.success("Sign out successfully");
                    localStorage.removeItem("access_token");
                    queryClient.removeQueries({ queryKey: ["profile"] });
                    navigate("/sign-in");
                },
                onError: error => {
                    toast.error(error.message);
                },
            });
        },
    },
};
