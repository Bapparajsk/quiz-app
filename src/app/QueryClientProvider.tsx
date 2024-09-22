"use client";
import {ReactNode, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function QueryClientProviders({children}: {children: ReactNode}) {

    const [queryClient] = useState(() => new QueryClient());

    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}