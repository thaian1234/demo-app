import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import AuthProvider from "./providers/auth.provider.tsx";

import RootLayout from "./layouts/root.layout.tsx";

import LoginPage from "./pages/login.page.tsx";
import SignUpPage from "./pages/signup.page.tsx";
import HomePage from "./pages/home.page.tsx";
import AuthLayout from "./layouts/auth.layout.tsx";
import OtpPage from "./pages/otp.page.tsx";
import ResetPasswordPage from "./pages/reset-password.page.tsx";
import { ROUTES } from "./configs/routes.config.ts";

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                element: <AuthProvider requireAuth={false} />,
                children: [
                    {
                        element: <AuthLayout />,
                        children: [
                            {
                                element: <LoginPage />,
                                path: ROUTES.signIn,
                            },
                            {
                                element: <SignUpPage />,
                                path: ROUTES.signUp,
                            },
                            {
                                element: <OtpPage />,
                                path: ROUTES.otpVerification,
                            },
                            {
                                element: <ResetPasswordPage />,
                                path: ROUTES.resetPassword,
                            },
                        ],
                    },
                ],
            },

            {
                element: <AuthProvider requireAuth />,
                children: [
                    {
                        element: <HomePage />,
                        path: ROUTES.home,
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
