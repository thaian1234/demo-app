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

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
    const form = useForm({
        resolver: zodResolver(authRequestSchema.signup),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    });
    const authMutation = authApi.mutation.useSignup();
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
                    <h1 className="text-2xl font-bold">Create new account</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your information below to sign up your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="didongviet"
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
                        Sign up
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Have an account?{" "}
                    <Link to={"/sign-in"} className="underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </form>
        </Form>
    );
}
