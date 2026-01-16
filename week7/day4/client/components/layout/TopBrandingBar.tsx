"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import Image from "next/image";

export const TopBrandingBar = () => {
    return (
        <Box sx={{
            bgcolor: "#000",
            color: "#fff",
            position: "relative",
            height: 300,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            pl: 6
        }}>
            {/* Background Image */}
            <Image
                src="/home/topBar.png"
                alt="Top Bar Background"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
            />

            {/* Overlay Content */}
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, height: "100%", display: "flex", alignItems: "center" }}>
                <Box sx={{ maxWidth: { xs: "100%", md: "480px" } }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: "40px",
                            mb: '29px',
                            fontWeight: 900,
                            letterSpacing: "0px",
                            fontStyle: "italic",
                            lineHeight: 1
                        }}
                    >
                        WE ARE NEVER DONE
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "20px",
                            fontWeight: 900,
                            color: "#fff",
                            lineHeight: 1,
                            mb: '29px',

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
                            px: "25px",
                            py: "4px",
                            fontSize: "16px",
                            fontWeight: 600,
                            textTransform: "none",
                            "&:hover": { bgcolor: "#eee" }
                        }}
                    >
                        Celebrate with us
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};
