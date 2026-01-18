"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import Image from "next/image";

export const TopBrandingBar = () => {
    return (
        <>
            {/* Desktop Version */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                bgcolor: "#000",
                color: "#fff",
                position: "relative",
                minHeight: 300,
                alignItems: "center",
                overflow: "hidden",
                px: { md: 6 }
            }}>
                <Image
                    src="/home/topBar.png"
                    alt="Top Bar Background"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center", opacity: 1 }}
                />
                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, height: "100%", display: "flex", alignItems: "center" }}>
                    <Box sx={{ maxWidth: "600px", textAlign: "left" }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: "clamp(28px, 6vw, 40px)",
                                mb: '20px',
                                fontWeight: 900,
                                letterSpacing: "0px",
                                fontStyle: "italic",
                                lineHeight: 1.1
                            }}
                        >
                            WE ARE NEVER DONE
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: "clamp(16px, 4vw, 20px)",
                                fontWeight: 400,
                                color: "#fff",
                                lineHeight: 1.4,
                                mb: '29px',
                                maxWidth: "480px"
                            }}
                        >
                            Celebrating 50 years of Nike from May 16th! Exclusive products, experiences and much more await you for five days. Scan and join the Nike app!
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#fff",
                                color: "#000",
                                borderRadius: "16px",
                                px: "30px",
                                py: "10px",
                                fontSize: "16px",
                                fontWeight: 700,
                                textTransform: "none",
                                "&:hover": { bgcolor: "#eee" }
                            }}
                        >
                            Celebrate with us
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Mobile Version */}
            <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
                {/* Upper Image (Collage) */}
                <Box sx={{ width: "100%", position: "relative", height: "180px" }}>
                    <Image
                        src="/home/hero-mobile-1.jpg"
                        alt="Nike Heritage"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </Box>

                {/* Lower Section (Text + QR Background) */}
                <Box sx={{
                    position: "relative",
                    bgcolor: "#111",
                    color: "#fff",
                    p: 4,
                    pt: 5,
                    pb: 8,
                    overflow: "hidden"
                }}>
                    {/* Background with Arrow/QR */}
                    <Image
                        src="/home/hero-mobile-2.jpg"
                        alt="Background Decor"
                        fill
                        style={{ objectFit: "cover", opacity: 1 }}
                    />

                    <Box sx={{ position: "relative", zIndex: 2 }}>
                        <Typography
                            sx={{
                                fontSize: "24px",
                                fontWeight: 900,
                                fontStyle: "italic",
                                textTransform: "uppercase",
                                mb: 3,
                                letterSpacing: "0.5px"
                            }}
                        >
                            WE ARE NEVER DONE
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "16px",
                                fontWeight: 500,
                                mb: 4,
                                lineHeight: 1.3,
                                maxWidth: "85%"
                            }}
                        >
                            Celebrating 50 years of Nike from May 16th! Exclusive products, experiences and much more await you for five days. Scan and join the Nike app!
                        </Typography>

                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "#fff",
                                color: "#000",
                                borderRadius: "8px",
                                px: 3,
                                py: 1,
                                fontSize: "14px",
                                fontWeight: 700,
                                textTransform: "none",
                                "&:hover": { bgcolor: "#f5f5f5" }
                            }}
                        >
                            Celebrate with us
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
