"use client";

import { Box, Container, Typography, Grid, Stack, Link } from "@mui/material";
import Image from "next/image";

export const Footer = () => {
    return (
        <Box sx={{ bgcolor: "#000", color: "#fff", borderTop: "1px solid #1a1a1a", pb: 4 }}>
            <Container maxWidth="xl" >
                {/* Main Footer Content */}
                <Box sx={{ position: "relative", }}>
                    <Grid container spacing={4} alignItems="center">
                        {/* Left Links */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Stack spacing="30px" sx={{ fontSize: "18px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>
                                <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#888" } }}>ALL</Link>
                                <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#888" } }}>WOMAN</Link>
                                <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#888" } }}>MEN</Link>
                            </Stack>
                        </Grid>

                        {/* Center Logo Section */}
                        <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "center", position: "relative" }}>
                            <Box sx={{
                                position: "relative",
                                height: { xs: 200, md: 300 },
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                {/* Circle GIF (Background) */}
                                <Box sx={{
                                    position: "absolute",
                                    width: 180,
                                    height: 180,

                                    zIndex: 0,
                                    mixBlendMode: "screen",
                                    borderRadius: "50%",
                                    overflow: "hidden"
                                }}>
                                    <Image
                                        src="/home/footerCircle.gif"
                                        alt="Footer Circle"
                                        fill
                                        style={{ objectFit: "contain", scale: 1.05 }}
                                        unoptimized
                                    />
                                </Box>

                                {/* Swoosh Logo (Foreground) */}
                                <Box sx={{
                                    position: "relative",
                                    width: { xs: 250, md: 350 },
                                    height: { xs: 100, md: 150 },
                                    zIndex: 1
                                }}>
                                    <Image
                                        src="/home/footerLogo.png"
                                        alt="Nike Logo"
                                        fill
                                        style={{ objectFit: "contain" }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right Links */}
                        <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: "center", }}>
                            <Stack spacing="30px" sx={{ fontSize: "18px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px" }}>
                                <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#888" } }}>WORKOUT</Link>
                                <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#888" } }}>RUN</Link>
                                <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#888" } }}>FOOTBALL</Link>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>


            </Container>
        </Box >
    );
};
