"use client";

import { Box, Typography, IconButton, Button } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";

export const DiscountCard = ({ title, discount, image }: { title: string, discount: string, image: string }) => (
    <Box sx={{
        borderRadius: '24px',
        p: { xs: 3, md: 5 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: { xs: 180, md: 250 },
        width: "100%",
        height: { md: "clamp(220px, 22vw, 272px)" },
        bgcolor: "#EFEFEF",
        boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
        position: "relative",
    }}>
        {/* Mobile View Content (Cart Icon) */}
        <Box sx={{ display: { xs: "block", md: "none" }, position: "relative", zIndex: 2 }}>
            <Typography sx={{ color: '#FF3939', fontSize: "20px", mb: 0.2, fontWeight: 900 }}>
                {discount} Discount
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: "14px", color: "#202727", mb: 2 }}>{title}</Typography>

            <IconButton size="small" sx={{
                bgcolor: "#fff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                p: 1.2
            }}>
                <ShoppingCartOutlinedIcon sx={{ fontSize: "20px", color: "#000" }} />
            </IconButton>
        </Box>

        {/* Desktop View Content (Shop Now Button) */}
        <Box sx={{ display: { xs: "none", md: "block" }, position: "relative", zIndex: 2 }}>
            <Typography variant="h3" sx={{ color: '#FF3939', fontSize: "30px", mb: 0.5, fontWeight: 900 }}>
                {discount} <span style={{ fontSize: "24px" }}>Discount</span>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '20px', color: "#202727", mb: 3 }}>{title}</Typography>
            <Button variant="contained" sx={{
                bgcolor: "#000",
                color: "#fff",
                fontWeight: 400,
                fontSize: '20px',
                borderRadius: '16px',
                "&:hover": { bgcolor: "#333" },
                px: 4
            }}>
                Shop now
            </Button>
        </Box>

        {/* Product Image */}
        <Box
            sx={{
                position: "absolute",
                right: { xs: 0, md: 10 },
                top: { xs: -12, md: 10 },
                transform: {
                    xs: "rotate(-25.84deg)",
                    md: "rotate(-28.75deg)"
                },
                // Increased dimensions to provide more room
                width: { xs: "211px", md: "250px", lg: "356px" },
                height: { xs: "150px", md: "180px", lg: "220px" },
                filter: "drop-shadow(0 30px 20px rgba(0,0,0,0.15))",
                zIndex: 10,
                pointerEvents: "none"
            }}
        >
            <Image
                src={image}
                alt={title}
                fill
                style={{
                    objectFit: "contain",
                    // Added scale to normalize visual size for images with whitespace
                    transform: "scale(1.15)",
                }}
            />
        </Box>
    </Box>
);
