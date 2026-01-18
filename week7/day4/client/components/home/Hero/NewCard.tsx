"use client";

import { Box, Typography, IconButton } from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import Image from "next/image";

export const NewCard = ({
    title,
    image,
    side,
}: {
    title: string;
    image: string;
    side: "left" | "right";
}) => {
    const isLeft = side === "left";

    return (
        <Box
            sx={{
                position: { xs: "relative", lg: "absolute" },
                bottom: { lg: "clamp(-40px, -3vw, -60px)", xs: "auto" },

                // Fix: Ensure both cards are centered on xs/sm/md screens
                // and correctly positioned on lg+ screens
                left: isLeft
                    ? { lg: "clamp(32px, 5vw, 80px)", xs: "50%" }
                    : { lg: "auto", xs: "50%" },
                right: !isLeft
                    ? { lg: "clamp(32px, 5vw, 80px)", xs: "auto" }
                    : "auto",

                transform: { xs: "translateX(-50%)", lg: "none" },

                // Responsive width: more flexible to prevent overlap
                width: {
                    xs: "90%",
                    sm: "80%",
                    md: "70%",
                    lg: "clamp(450px, 40vw, 602px)"
                },
                height: {
                    xs: 200,
                    sm: 220,
                    lg: "clamp(220px, 22vw, 272px)"
                },

                bgcolor: "#EFEFEF",
                backdropFilter: "blur(12px)",
                p: { xs: 2, md: 3 },
                borderRadius: { xs: "20px", md: "18px" },
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                zIndex: 2,

                display: "flex",
                flexDirection: { xs: "row", lg: "column" },
                justifyContent: { xs: "space-between", lg: "flex-end" },
                alignItems: { xs: "center", lg: "flex-start" },
                mb: { xs: 4, lg: 0 },
            }}
        >
            {/* Text + Icon */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    maxWidth: { xs: "55%", lg: "228px" },
                    zIndex: 2,
                    textAlign: "left",
                    ml: { xs: 0, lg: "66px" },
                }}
            >
                <Typography
                    sx={{
                        color: "#FF3939",
                        fontWeight: 900,
                        fontStyle: "italic",
                        fontSize: { xs: "24px", sm: "32px", lg: "48px" },
                        lineHeight: 1,
                    }}
                >
                    NEW
                </Typography>

                <Typography
                    sx={{
                        color: "#000",
                        fontWeight: { xs: 600, lg: 400 },
                        textTransform: "uppercase",
                        letterSpacing: "1%",
                        fontSize: { xs: "12px", sm: "14px", lg: "20px" },
                        lineHeight: "1.2",
                        mb: { xs: 1, lg: "15px" },
                    }}
                >
                    {title}
                </Typography>

                <IconButton
                    sx={{
                        bgcolor: "#fff",
                        border: "1px solid #eee",
                        width: { xs: 35, lg: 45 },
                        height: { xs: 35, lg: 45 },
                        "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                >
                    <NorthEastIcon sx={{ fontSize: { xs: 16, lg: 20 } }} />
                </IconButton>
            </Box>

            {/* Shoe Image */}
            <Box
                sx={{
                    position: "absolute",
                    right: { xs: -10, lg: -25 },
                    top: { xs: -50, lg: 0 },
                    transform: "rotate(-28.75deg)",
                    // Image responsiveness: using clamp to scale between sizes
                    width: {
                        xs: "180px",
                        sm: "240px",
                        md: "300px",
                        lg: "clamp(350px, 30vw, 409px)"
                    },
                    height: {
                        xs: "140px",
                        sm: "180px",
                        md: "220px",
                        lg: "clamp(200px, 18vw, 231px)"
                    },
                    filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
                    zIndex: 1,
                    pointerEvents: "none"
                }}
            >
                <Image
                    src={image}
                    alt={title}
                    fill
                    style={{ objectFit: "contain" }}
                />
            </Box>
        </Box>
    );
};

