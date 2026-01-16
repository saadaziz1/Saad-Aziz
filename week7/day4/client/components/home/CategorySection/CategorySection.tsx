"use client";

import { Box, Container, Typography, Stack } from "@mui/material";
import { CategoryRow } from "./CategoryRow";

export const CategorySection = () => {
    return (
        <Box sx={{ py: 10, }}>
            <Container maxWidth="xl">
                <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "none", fontSize: "40px", mb: "30px" }}>Buy by category</Typography>

                <Stack>
                    <CategoryRow title="WORKOUT" image="/home/workout.gif" />
                    <CategoryRow title="RUN" image="/home/run.gif" reverse />
                    <CategoryRow title="FOOTBALL" image="/home/football.gif" />
                </Stack>

                <Box sx={{ textAlign: "center", mt: "100px", mb: "50px" }}>
                    <Typography variant="h3" sx={{ fontSize: "40px", fontStyle: "italic", fontWeight: 900 }}>
                        LOOKS GOOD. RUNS GOOD. FEELS GOOD.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};
