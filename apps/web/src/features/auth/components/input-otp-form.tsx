import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authRequestSchema } from "../api/type";
import { authApi } from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function InputOTPForm() {
    const navigate = useNavigate();
    const userId = authApi.query.useGetUserId();
    const authMutation = authApi.mutation.useVerifyEmail();
    const form = useForm({
        resolver: zodResolver(authRequestSchema.verifyEmail),
        defaultValues: {
            code: "",
        },
    });

    useEffect(() => {
        if (!userId) {
            console.log("userId is undefined, redirecting to sign-up");
            navigate("/sign-up", {
                replace: true,
            });
        }
    }, [userId, navigate]);

    const onSubmit = form.handleSubmit(data => {
        if (!userId) {
            navigate("/sign-up", {
                replace: true,
            });
            return;
        }
        console.log("userId", userId);
        authMutation.mutate({
            code: data.code,
            userId: userId,
        });
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>OTP Password</FormLabel>
                            <FormControl>
                                <InputOTP
                                    maxLength={8}
                                    disabled={authMutation.isPending}
                                    {...field}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                        <InputOTPSlot index={6} />
                                        <InputOTPSlot index={7} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the OTP code sent to your email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
