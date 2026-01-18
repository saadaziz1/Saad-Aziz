"use client";

import { Box, Typography, Stack } from "@mui/material";
import { CategoryRow } from "./CategoryRow";

export const CategorySection = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            {/* Title container with padding to maintain alignment */}
            <Box sx={{ px: { xs: 2, sm: 4, xl: 8 }, mb: "30px" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "none", fontSize: { xs: "28px", md: "40px" } }}>
                    Buy by category
                </Typography>
            </Box>

            {/* Full-width category rows */}
            <Stack>
                <CategoryRow title="WORKOUT" image="/home/workout.gif" />
                <CategoryRow title="RUN" image="/home/run.gif" reverse />
                <CategoryRow title="FOOTBALL" image="/home/football.gif" />
            </Stack>

            {/* Bottom text container */}
            <Box sx={{ textAlign: "center", mt: { xs: 6, md: "100px" }, mb: "50px", px: 2, display: { xs: "none", md: "block" } }}>
                <Typography variant="h3" sx={{ fontSize: { xs: "24px", md: "40px" }, fontStyle: "italic", fontWeight: 900 }}>
                    LOOKS GOOD. RUNS GOOD. FEELS GOOD.
                </Typography>
            </Box>
        </Box>
    );
};
