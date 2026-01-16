"use client";

import { Stack, Box, Typography } from "@mui/material";
import Image from "next/image";

export const CategoryRow = ({ title, image, reverse = false }: { title: string, image: string, reverse?: boolean }) => (
    <Stack direction={{ xs: reverse ? "column-reverse" : "column", md: reverse ? "row-reverse" : "row" }} spacing={0} sx={{ height: { xs: "auto", md: 500 } }}>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
            <Typography variant="h1" sx={{ fontSize: "36px", fontStyle: "italic", fontWeight: 700, letterSpacing: "5px" }}>{title}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: "#eee", position: "relative", minHeight: 300 }}>
            <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />
        </Box>
    </Stack>
);
