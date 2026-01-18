"use client";

import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    IconButton,
    Grid,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import toast from "react-hot-toast";
import { useGetProductByIdQuery } from "@/redux/features/products/productsApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useAppSelector } from "@/redux/hooks";
import { useParams, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const ProductPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: productData, isLoading, error } = useGetProductByIdQuery(id as string);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [isMounted, setIsMounted] = useState(false);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const [selectedSize, setSelectedSize] = useState("");
    const [activeImage, setActiveImage] = useState("");

    React.useEffect(() => {
        if (productData?.image?.[0]?.url) {
            setActiveImage(productData.image[0].url);
        }
    }, [productData]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to add to cart");
            router.push("/login");
            return;
        }
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }
        try {
            await addToCart(id as string).unwrap();
            toast.success("Added to cart!");
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to add to cart");
        }
    };

    if (!isMounted) return null;
    if (isLoading) return <LoadingScreen />;
    if (error || !productData) return <Box sx={{ py: 20, textAlign: "center" }}><Typography variant="h5" color="error">Product not found</Typography></Box>;

    const displayImage = activeImage || productData?.image?.[0]?.url || "/products/grey.png";

    const product = {
        ...productData,
        image: productData.image?.[0]?.url || "/products/grey.png",
        price: `$${productData.price}`,
        description: "The Air Jordan 1 Mid brings full-court style and premium comfort to an iconic look. Its Air-Sole unit cushions play on the hardwood, while the padded collar gives you a supportive feel.",
        images: productData.image?.map((img: any) => img.url) || [],
        sizes: productData.sizes || [],
    };

    return (
        <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
            <Navbar />

            <main>
                <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
                    <Grid container spacing={{ xs: 4, md: 8 }}>
                        {/* Image Gallery */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Box sx={{ position: "sticky", top: 100 }}>
                                {/* Main Large Image */}
                                <Box sx={{
                                    width: "100%",
                                    aspectRatio: "1/1",
                                    bgcolor: "#f5f5f5",
                                    borderRadius: "24px",
                                    overflow: "hidden",
                                    position: "relative",
                                    mb: 2
                                }}>
                                    <Image
                                        src={displayImage}
                                        alt={product.name}
                                        fill
                                        style={{ objectFit: "contain", padding: "40px" }}
                                    />
                                </Box>

                                {/* Thumbnails */}
                                <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
                                    {product.images.map((img: string, idx: number) => (
                                        <Box
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: "#f5f5f5",
                                                borderRadius: "12px",
                                                overflow: "hidden",
                                                position: "relative",
                                                cursor: "pointer",
                                                border: activeImage === img ? "2px solid #000" : "2px solid transparent",
                                                flexShrink: 0
                                            }}
                                        >
                                            <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill style={{ objectFit: "contain", padding: "8px" }} />
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Product Details */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#FF3939", mb: 1 }}>
                                    New Release
                                </Typography>
                                <Typography variant="h1" sx={{
                                    fontSize: { xs: "32px", md: "48px" },
                                    fontWeight: 900,
                                    fontStyle: "italic",
                                    lineHeight: 1.1,
                                    mb: 2,
                                    textTransform: "uppercase"
                                }}>
                                    {product.name}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
                                    {product.price}
                                </Typography>

                                <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}>
                                    {product.description}
                                </Typography>

                                {/* Size Selection */}
                                <Box sx={{ mb: 4 }}>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Select Size</Typography>
                                        <Typography variant="body2" sx={{ color: "#aaa", cursor: "pointer", "&:hover": { color: "#000" } }}>Size Guide</Typography>
                                    </Stack>
                                    <Grid container spacing={1}>
                                        {product.sizes.map((size: string) => (
                                            <Grid key={size} size={{ xs: 4, sm: 3 }}>
                                                <Button
                                                    fullWidth
                                                    onClick={() => setSelectedSize(size)}
                                                    sx={{
                                                        border: "1px solid #eee",
                                                        borderRadius: "12px",
                                                        height: "56px",
                                                        fontWeight: 600,
                                                        bgcolor: selectedSize === size ? "#000" : "transparent",
                                                        color: selectedSize === size ? "#fff" : "#000",
                                                        "&:hover": { bgcolor: selectedSize === size ? "#222" : "#f5f5f5", border: "1px solid #000" }
                                                    }}
                                                >
                                                    {size}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>

                                {/* Actions */}
                                <Stack spacing={2}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleAddToCart}
                                        startIcon={<ShoppingBagOutlinedIcon />}
                                        sx={{
                                            bgcolor: "#000",
                                            color: "#fff",
                                            height: "64px",
                                            borderRadius: "32px",
                                            fontSize: "18px",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            "&:hover": { bgcolor: "#333" }
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            borderColor: "#eee",
                                            color: "#000",
                                            height: "64px",
                                            borderRadius: "32px",
                                            fontSize: "18px",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            "&:hover": { borderColor: "#000", bgcolor: "transparent" }
                                        }}
                                    >
                                        Favorite <FavoriteBorderIcon sx={{ ml: 1 }} />
                                    </Button>
                                </Stack>

                                {/* Accordions */}
                                <Box sx={{ mt: 6 }}>
                                    <Accordion elevation={0} sx={{ borderTop: "1px solid #eee", "&:before": { display: "none" } }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography sx={{ fontWeight: 600 }}>Shipping & Returns</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="body2" color="text.secondary">
                                                Free standard shipping on orders over $150. Return for free within 30 days.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion elevation={0} sx={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee", "&:before": { display: "none" } }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography sx={{ fontWeight: 600 }}>Reviews (42)</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="body2" color="text.secondary">
                                                ⭐⭐⭐⭐⭐ (4.8/5) - "Amazing comfort and style!"
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </main>

            <Footer />
        </Box>
    );
};

export default ProductPage;
