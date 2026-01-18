"use client";

import React from "react";
import { Box, Typography, keyframes } from "@mui/material";
import Image from "next/image";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const shiver = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-2px, 2px) rotate(-1deg); }
  50% { transform: translate(2px, -2px) rotate(1deg); }
  75% { transform: translate(-2px, -2px) rotate(-1deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const lineGrow = keyframes`
  0% { width: 0%; left: 0; }
  50% { width: 100%; left: 0; }
  100% { width: 0%; left: 100%; }
`;

export const LoadingScreen = ({ fullScreen = true }: { fullScreen?: boolean }) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: fullScreen ? "100vh" : "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#fff",
                zIndex: 9999,
                position: fullScreen ? "fixed" : "relative",
                top: 0,
                left: 0,
            }}
        >
            <Box sx={{ position: "relative", mb: 4 }}>
                {/* Background Text */}
                <Typography
                    sx={{
                        fontSize: "120px",
                        fontWeight: 900,
                        color: "rgba(0,0,0,0.03)",
                        fontStyle: "italic",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 0,
                        whiteSpace: "nowrap",
                        userSelect: "none"
                    }}
                >
                    LOADING
                </Typography>

                {/* Pulsing Logo */}
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        width: 100,
                        height: 40,
                        animation: `${pulse} 2s infinite ease-in-out`,
                    }}
                >
                    <Image
                        src="/home/Vector (2).png"
                        alt="Loading Logo"
                        fill
                        style={{ objectFit: "contain" }}
                    />
                </Box>
            </Box>

            {/* Custom Spinner / Progress Bar */}
            <Box sx={{ width: "200px", height: "2px", bgcolor: "#f0f0f0", position: "relative", overflow: "hidden" }}>
                <Box
                    sx={{
                        position: "absolute",
                        height: "100%",
                        bgcolor: "#000",
                        animation: `${lineGrow} 1.5s infinite ease-in-out`,
                    }}
                />
            </Box>

            <Typography
                sx={{
                    mt: 3,
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#888",
                    fontStyle: "italic"
                }}
            >
                Preparing your gear
            </Typography>
        </Box>
    );
};
