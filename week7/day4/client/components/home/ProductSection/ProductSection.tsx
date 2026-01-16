"use client";

import { Box, Container, Stack, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { SneakerCard } from "./SneakerCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRef } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const products = [
    { id: 1, name: "Air Max 97", category: "Men's Shoes", price: "$205.99", image: "/products/green.png" },
    { id: 2, name: "React Presto", category: "Men's Shoes", price: "$180.99", image: "/products/grey.png" },
    { id: 3, name: "Air Max 270", category: "Men's Shoes", price: "$150.99", image: "/products/nike-air-max-270.png" },
    { id: 4, name: "Air Max SE", category: "Men's Shoes", price: "$210.00", image: "/products/red-black-white.png" },
    { id: 5, name: "Air Max 97", category: "Men's Shoes", price: "$205.99", image: "/products/green.png" },
    { id: 6, name: "React Presto", category: "Men's Shoes", price: "$180.99", image: "/products/grey.png" },
];

export const ProductSection = () => {
    const swiperRef = useRef<any>(null);

    return (
        <Box sx={{ py: 6, overflow: "hidden" }}>
            <Container maxWidth="xl">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "none", fontSize: "40px" }}>
                        Top sneakers
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <IconButton
                            onClick={() => swiperRef.current?.slidePrev()}
                            size="small"
                            sx={{ bgcolor: "#eee", "&:hover": { bgcolor: "#ddd" } }}
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                            onClick={() => swiperRef.current?.slideNext()}
                            size="small"
                            sx={{ bgcolor: "#ddd", "&:hover": { bgcolor: "#ccc" } }}
                        >
                            <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Stack>
                </Stack>

                <Box sx={{
                    position: "relative",
                    "& .swiper": {
                        overflow: "visible",
                        pb: 6,
                        pt: 4,
                    }
                }}>
                    <Swiper
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        modules={[Navigation]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 1.5,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1440: {
                                slidesPerView: 3,
                            }
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <SneakerCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Container>
        </Box>
    );
};
