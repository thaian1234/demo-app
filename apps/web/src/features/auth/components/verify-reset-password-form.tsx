import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authApi } from "../api";
import { authRequestSchema } from "../api/type";

interface VerifyResetPasswordFormProps {
    token: string;
    props?: React.ComponentPropsWithoutRef<"form">;
}

export function VerifyResetPasswordForm({ props, token }: VerifyResetPasswordFormProps) {
    const form = useForm({
        resolver: zodResolver(authRequestSchema.verifyResetPassword),
        defaultValues: {
            token: token,
            newPassword: "",
        },
    });
    const authMutation = authApi.mutation.useVerifyResetPassword();
    const onSubmit = form.handleSubmit(data => {
        authMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
            },
        });
    });

    return (
        <Form {...form}>
            <form
                className={cn("flex flex-col gap-6", props?.className)}
                onSubmit={onSubmit}
                {...props}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Reset password</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="********"
                                        disabled={authMutation.isPending}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={authMutation.isPending}>
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}
