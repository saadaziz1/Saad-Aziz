"use client";

import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

export const DiscountCard = ({ title, discount, image }: { title: string, discount: string, image: string }) => (
    <Box sx={{

        borderRadius: '18px',
        p: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 250,
        width: { xs: "90%", sm: "85%", md: "clamp(480px, 42vw, 602px)" },
        height: { xs: "auto", md: "clamp(220px, 22vw, 272px)" },

        bgcolor: "#EFEFEF",
        boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
        position: "relative",

    }}>
        <Box sx={{ position: "relative", zIndex: 2 }}>
            <Typography variant="h3" sx={{ color: '#FF3939', fontStyle: "normal", fontSize: "30px", mb: 0.5, fontWeight: 700 }}>{discount} <span style={{ fontSize: "24px" }}>Discount</span></Typography>
            <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '20px', color: "#202727", mb: 3 }}>{title}</Typography>
            <Button variant="contained" sx={{ bgcolor: "#000", color: "#fff", fontWeight: 400, fontSize: '20px', borderRadius: '16px', "&:hover": { bgcolor: "#333" }, px: 4 }}>
                Shop now
            </Button>
        </Box>
        {/* Product Image */}
        <Box
            sx={{
                position: { xs: "relative", md: "absolute" },
                right: { md: -0, xs: "auto" },
                top: { md: 10, xs: "auto" },
                width: "356px",
                height: "179px",
                transform: { md: "rotate(-28.75deg)", xs: "none" },
                filter: "drop-shadow(0 30px 20px rgba(0,0,0,0.2))",
                mt: { xs: 3, md: 0 },
            }}
        >
            <Image
                src={image}
                alt={title}
                width={356}
                height={179}

            />
        </Box>
    </Box>
);
