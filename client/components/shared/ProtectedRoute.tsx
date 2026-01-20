"use client";

import { useAppSelector } from "@/libredux/hooks";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [isAuthenticated, router, pathname, mounted]);

    // During hydration, we must return the same thing as the server
    if (!mounted) {
        return null;
    }

    if (!isAuthenticated && pathname !== "/login") {
        return null;
    }

    return <>{children}</>;
}
