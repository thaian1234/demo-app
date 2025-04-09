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
import { Link } from "react-router-dom";
import { ROUTES } from "@/configs/routes.config";

export function RequestResetPasswordForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const form = useForm({
        resolver: zodResolver(authRequestSchema.requestResetPassword),
        defaultValues: {
            email: "",
        },
    });
    const authMutation = authApi.mutation.useRequestResetPassword();
    const onSubmit = form.handleSubmit(data => {
        authMutation.mutate(data, {
            onSuccess: () => {
                form.reset();
            },
        });
    });

    return (
        <Form {...form}>
            <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Refresh your password</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your email below to refresh password
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        disabled={authMutation.isPending}
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
                <div className="text-center text-sm">
                    Have an account?{" "}
                    <Link to={ROUTES.signIn} className="underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </form>
        </Form>
    );
}
