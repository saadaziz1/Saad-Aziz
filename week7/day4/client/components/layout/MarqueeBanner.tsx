"use client";

import Image from "next/image";
import { Box } from "@mui/material";

export const MarqueeBanner = () => {
    return (
        <Box sx={{
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            height: 60,
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Box sx={{ position: "relative", width: "100%", height: 40 }}>
                <Image
                    src="/home/justDoIt.gif"
                    alt="Just Do It"
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                />
            </Box>
        </Box>
    );
};
