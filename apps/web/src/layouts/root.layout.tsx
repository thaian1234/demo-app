import ReactQueryProvider from "@/providers/react-query.provider";

import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
    return (
        <ReactQueryProvider>
            <Outlet />
            <Toaster />
        </ReactQueryProvider>
    );
}
