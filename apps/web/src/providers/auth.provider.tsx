import { authApi } from "@/features/auth/api";
import { User } from "@/types/common";
import { HttpStatusCode } from "axios";
import { createContext, useContext } from "react";
import { Outlet, useNavigate } from "react-router";

interface AuthContextType {
    user: User | undefined;
    isLoading: boolean;
    error: Error | null;
    isSignedIn: boolean;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider() {
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = authApi.query.useGetProfile();
    const isSignedIn = !isError;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || data?.statusCode === HttpStatusCode.Unauthorized) {
        navigate("/sign-in", {
            replace: true,
        });
        return;
    }

    return (
        <UserContext.Provider
            value={{
                user: data?.data,
                isLoading,
                error,
                isSignedIn,
            }}
        >
            <Outlet />
        </UserContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
