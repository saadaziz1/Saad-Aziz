"use client";

import React from "react";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
    useRealtimeNotifications();
    return <>{children}</>;
};
