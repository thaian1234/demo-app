import { authApi } from "@/features/auth/api";
import { User } from "@/types/common";
import { HttpStatusCode } from "axios";
import { createContext, use } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { LOCAL_STORAGE } from "@/configs/axios.config";

interface AuthContextType {
    user: User | undefined;
    isLoading: boolean;
    error: Error | null;
    isSignedIn: boolean;
}

interface AuthProviderProps {
    requireAuth?: boolean;
    redirectTo?: string;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
    requireAuth = true,
    redirectTo = "/sign-in",
}: AuthProviderProps) {
    const location = useLocation();
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
    const { data, isLoading, isError, error } = authApi.query.useGetProfile(!!token);

    const isSignedIn = !isError && !!data?.data;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (requireAuth && (!isSignedIn || data?.statusCode === HttpStatusCode.Unauthorized)) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (!requireAuth && isSignedIn) {
        return <Navigate to="/" replace />;
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
    const context = use(UserContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
