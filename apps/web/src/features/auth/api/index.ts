import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "./service";
import { useNavigate } from "react-router-dom";
import { SigninRequest, SignupRequest, VerifyEmailRequest } from "./type";

const baseKey = "auth";
const KEYS = {
    profile: () => [`${baseKey}/profile`],
    userId: () => [`${baseKey}/userId`],
} as const;

export const authApi = {
    query: {
        useGetProfile() {
            return useQuery({
                queryKey: KEYS.profile(),
                queryFn: () => {
                    return authService.getProfile();
                },
            });
        },
        useGetUserId() {
            const queryClient = useQueryClient();
            const userId = queryClient.getQueryData(KEYS.userId());
            if (!userId) {
                return null;
            }
            return userId as string;
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
            const queryClient = useQueryClient();

            return useMutation({
                mutationFn: (input: SignupRequest) => {
                    queryClient.clear();
                    return authService.signup(input);
                },
                onSuccess: ({ data, message }) => {
                    toast.success(message);
                    queryClient.setQueryData(KEYS.userId(), data.userId);
                    navigate("/otp-verification");
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
                    queryClient.clear();
                    navigate("/sign-in");
                },
                onError: error => {
                    toast.error(error.message);
                },
            });
        },
        useVerifyEmail() {
            const navigate = useNavigate();
            const queryClient = useQueryClient();

            return useMutation({
                mutationFn: (input: VerifyEmailRequest) => authService.verifyEmail(input),
                onSuccess: ({ data, message }) => {
                    toast.success(message);
                    localStorage.setItem("access_token", data.accessToken);
                    queryClient.clear();
                    navigate("/");
                },
                onError: error => {
                    toast.error(error.message);
                },
            });
        },
    },
};
