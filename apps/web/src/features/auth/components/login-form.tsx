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
import { Link } from "react-router-dom";
import { authApi } from "../api";
import { authRequestSchema } from "../api/type";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
    const form = useForm({
        resolver: zodResolver(authRequestSchema.signin),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const authMutation = authApi.mutation.useSignin();
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
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your email below to login to your account
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="*******"
                                        type="password"
                                        disabled={authMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={authMutation.isPending}>
                        Sign in
                    </Button>
                </div>
                <div className="text-center text-sm space-y-2">
                    <div>
                        Don&apos;t have an account?{" "}
                        <Link to={"/sign-up"} className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                    <div>
                        Forgot your password?{" "}
                        <Link to={"/reset-password"} className="underline underline-offset-4">
                            Forgot?
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    );
}
