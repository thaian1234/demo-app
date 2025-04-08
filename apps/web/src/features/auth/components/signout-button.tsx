import { Button } from "@/components/ui/button";
import { authApi } from "../api";
import { LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
    className?: string;
    props?: React.ComponentPropsWithoutRef<"button">;
}
export function SignOutButton({ className, props }: SignOutButtonProps) {
    const authMutation = authApi.mutation.useSignout();
    const handleSignOut = () => {
        authMutation.mutate();
    };

    return (
        <Button
            onClick={handleSignOut}
            className={cn(className)}
            disabled={authMutation.isPending}
            {...props}
        >
            <LogOutIcon className="mr-1 h-4 w-4" />
            Sign Out
        </Button>
    );
}
