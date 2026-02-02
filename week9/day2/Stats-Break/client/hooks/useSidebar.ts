"use client";
import { useState, useEffect } from "react";

export const useSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false);
            else setIsOpen(true);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggle = () => setIsOpen(!isOpen);
    const close = () => {
        if (isMobile) setIsOpen(false);
    };

    return { isOpen, toggle, close, isMobile };
};
