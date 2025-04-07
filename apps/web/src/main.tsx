import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import AuthProvider from "./providers/auth.provider.tsx";

import RootLayout from "./layouts/root.layout.tsx";

import LoginPage from "./pages/login.page.tsx";
import SignUpPage from "./pages/signup.page.tsx";
import HomePage from "./pages/home.page.tsx";

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                element: <LoginPage />,
                path: "/sign-in",
            },
            {
                element: <SignUpPage />,
                path: "/sign-up",
            },
            {
                element: <AuthProvider />,
                children: [
                    {
                        element: <HomePage />,
                        path: "/",
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
