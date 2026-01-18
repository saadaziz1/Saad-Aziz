"use client";

import { Stack, Box, Typography } from "@mui/material";
import Image from "next/image";

export const CategoryRow = ({ title, image, reverse = false }: { title: string, image: string, reverse?: boolean }) => (
    <Box sx={{ position: "relative", height: { xs: "100%", md: 500 } }}>
        {/* Desktop Layout: Split side-by-side design */}
        <Stack
            direction={reverse ? "row-reverse" : "row"}
            sx={{ display: { xs: "none", md: "flex" }, height: "100%", width: "100%" }}
        >
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#fff" }}>
                <Typography variant="h1" sx={{
                    fontSize: "clamp(40px, 5vw, 64px)",
                    fontStyle: "italic",
                    fontWeight: 700,
                    letterSpacing: "5px",
                    textTransform: "uppercase"
                }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ flex: 1, bgcolor: "#eee", position: "relative" }}>
                <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />
            </Box>
        </Stack>

        {/* Mobile Layout: Full-width image with text overlay (matches mobile mockup) */}
        <Box sx={{
            display: { xs: "block", md: "none" },
            height: "330px",
            position: "relative",
            overflow: "hidden"
        }}>
            <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />
            <Box sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.15)"
            }}>
                <Typography sx={{
                    fontSize: "clamp(32px, 10vw, 64px)",
                    fontStyle: "italic",
                    fontWeight: 700,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "5px",
                    textAlign: "center"
                }}>
                    {title}
                </Typography>
            </Box>
        </Box>
    </Box>
);
