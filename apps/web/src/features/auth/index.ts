import { useMutation } from "@tanstack/react-query";
import { SigninRequest } from "./type";
import { authService } from "./service";
import { toast } from "sonner";

export const authApi = {
    query: {},
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
    },
};
