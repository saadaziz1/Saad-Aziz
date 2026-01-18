"use client";

import { Box, Container, Typography, Grid, Button } from "@mui/material";
import Image from "next/image";
import { DiscountCard } from "./DiscountCard";

export const MarketingBanner = () => {
    return (<>
        <Box sx={{ py: 6 }}>
            {/* Header: Only visible on mobile/tablet */}
            <Box sx={{ px: { xs: 2, sm: 4, xl: 8 } }}>
                <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", mb: 4, ml: "15%" }}>
                    <Typography variant="h1" sx={{
                        fontWeight: 900,
                        fontSize: "clamp(32px, 8vw, 64px)",
                        fontStyle: "italic",
                        lineHeight: 1.1,
                        textTransform: "uppercase",
                        textAlign: "left"
                    }}>
                        LOOKS GOOD.
                    </Typography>
                    <Typography variant="h1" sx={{
                        fontWeight: 900,
                        fontSize: "clamp(32px, 8vw, 64px)",
                        fontStyle: "italic",
                        lineHeight: 1.1,
                        textTransform: "uppercase",
                        textAlign: "left",
                        ml: "15%"
                    }}>
                        RUNS GOOD.
                    </Typography>
                    <Typography variant="h1" sx={{
                        fontWeight: 900,
                        fontSize: "clamp(32px, 8vw, 64px)",
                        fontStyle: "italic",
                        lineHeight: 1.1,
                        textTransform: "uppercase",
                        textAlign: "left",
                        ml: "30%"
                    }}>
                        FEELS GOOD.
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center" sx={{ mb: 10 }}>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center" }}>
                        <DiscountCard discount="-20%" title="on your first purchase" image="/products/grey.png" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center" }}>
                        <DiscountCard discount="-20%" title="on your first purchase" image="/products/green.png" />
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mb: 4, fontWeight: 800, textTransform: "uppercase", fontSize: "clamp(20px, 4vw, 32px)", letterSpacing: "1px" }}>MORE NIKE PRODUCTS</Typography>
            </Box>

            {/* Full-width Membership Banner */}
            <Box sx={{
                width: "100%",
                height: { xs: "auto", md: 450 },
                minHeight: 300,
                bgcolor: "#222",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                p: { xs: 4, md: 10 }
            }}>
                <Image src="/home/cta.png" alt="Membership Image" fill style={{ objectFit: "cover" }} />

                <Box sx={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
                    <Typography variant="h2" sx={{ color: "#fff", mb: 2, fontSize: "clamp(32px, 6vw, 56px)", fontStyle: 'italic', fontWeight: 900 }}>YOUR NIKE MEMBERSHIP</Typography>
                    <Typography variant="body2" sx={{ color: "#fff", mb: 4, fontWeight: 400, fontSize: "clamp(18px, 3vw, 24px)" }}>
                        Join our members and show your love with<br />
                        <span style={{ fontWeight: 700 }}>Nike By You!</span>
                    </Typography>
                    <Button variant="contained" sx={{ fontSize: '18px', bgcolor: "#fff", color: "#000", "&:hover": { bgcolor: "#eee" }, borderRadius: "30px", px: 6, py: 1.5 }}>
                        Join us
                    </Button>
                </Box>
            </Box>
        </Box>
        <Box sx={{ textAlign: "center", mb: 10, mt: "50px" }}>
            <Typography variant="body2" sx={{ color: "#000", textTransform: "uppercase", letterSpacing: 1, mb: "30px", fontSize: "24px", fontWeight: 400 }}>Thanks for watching</Typography>
            <Typography variant="h1" sx={{ mb: "30px", fontWeight: 900, fontSize: "clamp(32px, 5vw, 48px)", fontStyle: "italic" }}>Glory to Ukraine</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 2.67858C0 2.67858 12.1021 5.35717 20 5.35717C27.8979 5.35717 40 2.67858 40 2.67858C40 2.67858 52.1021 0 60 0C67.8979 0 80 2.67858 80 2.67858V25.0001C80 25.0001 67.8979 22.3215 60 22.3215C52.1021 22.3215 40 25.0001 40 25.0001C40 25.0001 27.8979 27.6787 20 27.6787C12.1021 27.6787 0 25.0001 0 25.0001V2.67858Z" fill="#53C8FB" />
                    <path d="M0 24.9999C0 24.9999 12.1021 27.6785 20 27.6785C27.8979 27.6785 40 24.9999 40 24.9999C40 24.9999 52.1021 22.3213 60 22.3213C67.8979 22.3213 80 24.9999 80 24.9999V47.3214C80 47.3214 67.8979 44.6428 60 44.6428C52.1021 44.6428 40 47.3214 40 47.3214C40 47.3214 27.8979 50 20 50C12.1021 50 0 47.3214 0 47.3214V24.9999Z" fill="#FFED46" />
                </svg>
            </Box>
        </Box>
    </>
    );
};
