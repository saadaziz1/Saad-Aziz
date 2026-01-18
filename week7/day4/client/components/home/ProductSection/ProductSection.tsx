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

import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const ProductSection = () => {
    const swiperRef = useRef<any>(null);
    const { data: productsData, isLoading, error } = useGetProductsQuery();

    if (isLoading) return <LoadingScreen fullScreen={false} />;
    if (error) return <Box sx={{ py: 10, textAlign: "center" }}><Typography color="error">Failed to load sneakers</Typography></Box>;

    const products = productsData?.map((p: any) => ({
        ...p,
        image: p.image?.[0]?.url || "/products/grey.png",
        price: `$${p.price}`
    })) || [];


    return (
        <Box sx={{ py: 6, overflow: "hidden" }}>
            <Container maxWidth="xl">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, textTransform: "uppercase", fontSize: "clamp(24px, 5vw, 40px)", letterSpacing: "1px" }}>
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
