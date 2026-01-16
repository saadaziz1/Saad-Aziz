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
                position: { xs: "relative", md: "absolute" },
                bottom: { md: "clamp(-40px, -3vw, -60px)", xs: "auto" },

                [isLeft ? "left" : "right"]: {
                    md: "clamp(32px, 5vw, 80px)",
                    xs: "50%",
                },
                transform: { xs: "translateX(-50%)", md: "none" },

                width: { xs: "90%", sm: "85%", md: "clamp(480px, 42vw, 602px)" },
                height: { xs: "auto", md: "clamp(220px, 22vw, 272px)" },

                bgcolor: "#EFEFEF",
                backdropFilter: "blur(12px)",
                p: { xs: 2, md: 3 },
                borderRadius: { xs: "16px", md: "18px" },
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                zIndex: 2,

                display: "flex",
                flexDirection: { xs: "column", md: "column" },
                justifyContent: "flex-end",
                alignItems: { xs: "center", md: "flex-start" },
                mb: { xs: 6, md: 0 },
            }}
        >
            {/* Text + Icon */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1, md: 1 },
                    maxWidth: { xs: "100%", md: "228px" },
                    ml: { xs: 0, md: "66px" },
                    textAlign: { xs: "center", md: "left" },
                }}
            >
                <Typography
                    sx={{
                        color: "#FF3939",
                        fontWeight: 700,
                        fontStyle: "italic",
                        fontSize: { xs: "32px", sm: "36px", md: "48px" },
                        lineHeight: 1,
                    }}
                >
                    NEW
                </Typography>

                <Typography
                    sx={{
                        color: "#000",
                        fontWeight: 400,
                        textTransform: "uppercase",
                        letterSpacing: "1%",
                        fontSize: { xs: "16px", sm: "18px", md: "20px" },
                        lineHeight: "110%",
                        mb: { xs: 2, md: "15px" },
                    }}
                >
                    {title}
                </Typography>

                <IconButton
                    sx={{
                        bgcolor: "#fff",
                        border: "1px solid #eee",
                        width: { xs: 40, md: 45 },
                        height: { xs: 40, md: 45 },
                        alignSelf: { xs: "center", md: "flex-start" },
                        "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                >
                    <NorthEastIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                </IconButton>
            </Box>

            {/* Shoe Image */}
            <Box
                sx={{
                    position: { xs: "relative", md: "absolute" },
                    right: { md: -25, xs: "auto" },
                    top: { md: 0, xs: "auto" },
                    width: { xs: "80%", md: "409px" },
                    height: { xs: 180, md: "231px" },
                    transform: { md: "rotate(-28.75deg)", xs: "none" },
                    filter: "drop-shadow(0 30px 20px rgba(0,0,0,0.2))",
                    mt: { xs: 3, md: 0 },
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
