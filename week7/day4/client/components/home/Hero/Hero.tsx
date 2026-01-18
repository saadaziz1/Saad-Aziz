"use client";

import { Box, Container } from "@mui/material";
import Image from "next/image";
import { NewCard } from "./NewCard";

export const Hero = () => {
    return (
        <Box sx={{ position: "relative", mb: 10 }}>
            {/* Main Large Hero Image */}
            <Box sx={{
                width: "100%",
                height: 700,
                bgcolor: "#f5f5f5",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {/* Background Hero Image with Blur */}
                <Box sx={{ position: "absolute", inset: 0, filter: "blur(4px) brightness(0.95)" }}>
                    <Image
                        src="/home/hero.png"
                        alt="Hero Image"
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                    />
                </Box>

                {/* Swish Logo Overlay */}
                <Box sx={{
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 370,
                    height: 132,
                    bgcolor: "#fff",
                    maskImage: "url('/home/Vector (2).png')",
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                    opacity: 1,
                    zIndex: 1
                }} />

            </Box>

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10, bottom: 10 }}>
                <NewCard
                    side="left"
                    title="AIR JORDAN 1 MID LIGHT SMOKE GREY"
                    image="/products/nike-air-max-270.png"
                />
                <Box sx={{ mt: { lg: 20, xs: 2 } }}>
                    <NewCard
                        side="right"
                        title="Air Max 200 SE"
                        image="/products/red-black-white.png"
                    />
                </Box>
            </Container>
        </Box>
    );
};
