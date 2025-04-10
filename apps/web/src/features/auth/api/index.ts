import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "./service";
import { useNavigate } from "react-router-dom";
import {
    ResetPasswordRequest,
    SigninRequest,
    SignupRequest,
    VerifyEmailRequest,
    VerifyResetPasswordRequest,
} from "./type";
import { LOCAL_STORAGE } from "@/configs/axios.config";
import { ROUTES } from "@/configs/routes.config";

const baseKey = "auth";
const KEYS = {
    profile: () => [`${baseKey}/profile`],
    userId: () => [`${baseKey}/userId`],
} as const;

export const authApi = {
    query: {
        useGetProfile(isEnabled = true) {
            return useQuery({
                queryKey: KEYS.profile(),
                queryFn: () => {
                    return authService.getProfile();
                },
                staleTime: 5 * 60 * 1000,
                retry: false,
                enabled: isEnabled,
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
                    localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, data.accessToken);
                    navigate(ROUTES.home);
                },
                onError: error => {
                    toast.error(error.message);
                    if (localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)) {
                        localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
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
                    navigate(ROUTES.otpVerification);
                },
                onError: error => {
                    toast.error(error.message);
                    if (localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)) {
                        localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
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
                    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
                    queryClient.clear();
                    navigate(ROUTES.signIn);
                },
                onError: error => {
                    toast.error(error.message);
                },
            });
        },
        useVerifyEmail() {
            const navigate = useNavigate();

            return useMutation({
                mutationFn: (input: VerifyEmailRequest) => authService.verifyEmail(input),
                onSuccess: ({ data, message }) => {
                    toast.success(message);
                    localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, data.accessToken);
                    navigate(ROUTES.home);
                },
                onError: error => {
                    toast.error(error.message);
                },
            });
        },
        useRequestResetPassword() {
            return useMutation({
                mutationFn: (input: ResetPasswordRequest) =>
                    authService.requestResetPassword(input),
                onSuccess: ({ message }) => {
                    toast.success(message);
                },
                onError: error => {
                    toast.error(error.message);
                },
            });
        },
        useVerifyResetPassword() {
            const navigate = useNavigate();
            const queryClient = useQueryClient();

            return useMutation({
                mutationFn: (input: VerifyResetPasswordRequest) =>
                    authService.verifyResetPassword(input),
                onSuccess: ({ message }) => {
                    toast.success(message);
                    queryClient.clear();
                    navigate(ROUTES.signIn);
                },
                onError: error => {
                    toast.error(error.message);
                    navigate(ROUTES.signIn);
                },
            });
        },
    },
};
