"use client";

import { Box, Typography, IconButton, Card, CardContent, Stack } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";

export const SneakerCard = ({ product }: { product: any }) => (
    <Card sx={{
        height: 580,
        width: "100%",
        boxShadow: "none",
        bgcolor: "#EFEFEF",
        borderRadius: '18px',
        position: "relative",
        overflow: "visible",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        "&:hover": { bgcolor: "#eee" }
    }}>
        <Box sx={{
            height: 350, // Slightly reduced to allow content to overlap more
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            pt: 2
        }}>
            {/* Background NIKE text */}
            <Typography sx={{
                position: "absolute",
                fontSize: "160px",
                fontWeight: 900,
                color: "rgba(0, 0, 0, 0.04)",
                fontStyle: "italic",
                zIndex: 0,
                transform: "rotate(90deg)",
                bottom: 0, // Positioned at the bottom of its container
                pointerEvents: "none",
                userSelect: "none"
            }}>
                NIKE
            </Typography>

            {/* Product Image */}
            <Box sx={{
                zIndex: 1,
                width: "90%",
                height: "90%",
                position: "relative",
                transform: "rotate(-29deg) translateY(-20px)",
                filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.5))" // More prominent shadow
            }}>
                <Image
                    src={product.image || "/products/grey.png"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                />
            </Box>
        </Box>
        <CardContent sx={{
            position: "relative",
            zIndex: 2, // Ensure it's over the NIKE text
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pb: "2px !important",
            px: 4
        }}>
            <Typography sx={{ fontWeight: 900, fontSize: "40px", mb: 0.5 }}>{product.name}</Typography>
            <Typography sx={{ fontWeight: 400, fontSize: "20px" }}>{product.price}</Typography>


            <IconButton size="small" sx={{ bgcolor: "#fff", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", p: 1.5, alignSelf: "flex-end" }}>
                <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8251 15.5252L24.2515 2.10885H28V0H22.6136L21.8058 3.16266L0 3.14706L2.31828 15.5251H20.8251V15.5252ZM21.2674 5.27114L19.1871 13.4163H4.06882L2.5408 5.25775L21.2674 5.27114Z" fill="black" />
                    <path d="M17.9387 23.2105C19.7982 23.2105 21.3111 21.6976 21.3111 19.8381C21.3111 17.9785 19.7982 16.4657 17.9387 16.4657H5.23278C3.37324 16.4657 1.86035 17.9785 1.86035 19.8381C1.86035 21.6976 3.37321 23.2105 5.23278 23.2105C7.09236 23.2105 8.60518 21.6976 8.60518 19.8381C8.60518 19.3915 8.51769 18.965 8.35934 18.5746H14.8121C14.6537 18.965 14.5662 19.3915 14.5662 19.8381C14.5663 21.6976 16.0791 23.2105 17.9387 23.2105ZM6.49633 19.8381C6.49633 20.5348 5.92951 21.1016 5.23278 21.1016C4.53605 21.1016 3.96921 20.5348 3.96921 19.8381C3.96921 19.1414 4.53602 18.5746 5.23278 18.5746C5.92951 18.5746 6.49633 19.1414 6.49633 19.8381ZM19.2022 19.8381C19.2022 20.5348 18.6354 21.1016 17.9387 21.1016C17.242 21.1016 16.6751 20.5348 16.6751 19.8381C16.6751 19.1414 17.242 18.5746 17.9387 18.5746C18.6354 18.5746 19.2022 19.1414 19.2022 19.8381Z" fill="black" />
                </svg>

            </IconButton>
        </CardContent>
    </Card>
);
