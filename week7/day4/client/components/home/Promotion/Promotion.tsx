"use client";

import { Box, Container, Typography } from "@mui/material";

export const Promotion = () => {
    return (
        <Box sx={{ textAlign: "center", py: '100px' }}>
            <Container maxWidth="xl">
                <Typography variant="body1" sx={{ mb: 1, color: "#000", fontWeight: 400, fontSize: '40px' }}>
                    At the moment
                </Typography>
                <Typography variant="h1" sx={{ mb: 2, fontSize: "80px", fontWeight: 900, fontStyle: "italic" }}>
                    SUMMERTIME MOOD
                </Typography>
                <Typography variant="h6" sx={{ color: "#000", fontWeight: 400, fontSize: '40px' }}>
                    Fight the heat in a sunny look!
                </Typography>
            </Container>
        </Box>
    );
};
