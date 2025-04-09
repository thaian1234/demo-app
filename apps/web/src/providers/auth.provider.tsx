import { authApi } from "@/features/auth/api";
import { User } from "@/types/common";
import { HttpStatusCode } from "axios";
import { createContext, use, useEffect, useState } from "react";
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
    const { data, isLoading, isError, error, refetch } = authApi.query.useGetProfile();
    const [isInitializing, setIsInitializing] = useState(true);

    const isSignedIn = !isError && !!data?.data;

    useEffect(() => {
        const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);

        if (!token && requireAuth) {
            setIsInitializing(false);
            return;
        }

        if (token && !data?.data && !isLoading) {
            refetch().finally(() => {
                setIsInitializing(false);
            });
        } else {
            setIsInitializing(false);
        }
    }, [data, isLoading, refetch, requireAuth]);

    if (isInitializing || isLoading) {
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
