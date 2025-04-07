import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            retry: false,
        },
    },
});

export default function ReactQueryProvider() {
    return (
        <QueryClientProvider client={queryClient}>
            <Outlet />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
