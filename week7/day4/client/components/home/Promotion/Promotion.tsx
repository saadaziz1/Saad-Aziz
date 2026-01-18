"use client";

import { Box, Container, Typography } from "@mui/material";

export const Promotion = () => {
    return (
        <Box sx={{ textAlign: "center", py: { xs: "40px", md: "80px" } }}>
            <Container maxWidth="xl">
                <Typography variant="body1" sx={{ mb: 0.5, color: "#000", fontWeight: 400, fontSize: "clamp(18px, 4vw, 24px)" }}>
                    At the moment
                </Typography>
                <Typography variant="h1" sx={{
                    mb: 1,
                    fontSize: "clamp(36px, 8vw, 80px)",
                    fontWeight: 900,
                    fontStyle: "italic",
                    textTransform: "uppercase"
                }}>
                    SUMMERTIME MOOD
                </Typography>
                <Typography variant="h6" sx={{ color: "#000", fontWeight: 400, fontSize: "clamp(18px, 4vw, 24px)" }}>
                    Fight the heat in a sunny look!
                </Typography>
            </Container>
        </Box>
    );
};
