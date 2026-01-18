"use client";

import React from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    IconButton,
    Grid,
    Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from "@/redux/features/cart/cartApi";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import toast from "react-hot-toast";
import NextLink from "next/link";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const CartPage = () => {
    const router = useRouter();
    const [isMounted, setIsMounted] = React.useState(false);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: cartData, isLoading } = useGetCartQuery(undefined, {
        skip: !isAuthenticated || !isMounted
    });
    const [updateQty] = useUpdateCartItemMutation();
    const [removeItem] = useRemoveFromCartMutation();

    React.useEffect(() => {
        if (isMounted && !isAuthenticated) {
            toast.error("Please login to view your cart");
            router.push("/login");
        }
    }, [isAuthenticated, isMounted, router]);

    const cartItems = cartData?.items || [];
    const subtotal = cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const shipping = cartItems.length > 0 ? 15.00 : 0;
    const total = subtotal + shipping;

    const handleUpdateQty = async (productId: string, currentQty: number, delta: number) => {
        if (currentQty + delta <= 0) return;
        try {
            await updateQty({ productId, qty: currentQty + delta }).unwrap();
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update quantity");
        }
    };

    const handleRemove = async (productId: string, name: string) => {
        try {
            await removeItem(productId).unwrap();
            toast.success(`${name} removed from cart`);
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to remove item");
        }
    };

    if (!isMounted) return null;
    if (isLoading) return <LoadingScreen />;

    return (
        <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
            <Navbar />

            <main>
                <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
                    <Typography variant="h3" sx={{
                        fontWeight: 900,
                        fontStyle: "italic",
                        textTransform: "uppercase",
                        mb: 6,
                        fontSize: { xs: "32px", md: "48px" }
                    }}>
                        Bag
                    </Typography>

                    <Grid container spacing={6}>
                        {/* Cart Items List */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            {cartItems.length > 0 ? (
                                <Stack spacing={4}>
                                    {cartItems.map((item: any) => (
                                        <Box key={item.productId}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 4, sm: 3 }}>
                                                    <Box sx={{
                                                        width: "100%",
                                                        aspectRatio: "1/1",
                                                        bgcolor: "#f5f5f5",
                                                        borderRadius: "16px",
                                                        position: "relative",
                                                        overflow: "hidden"
                                                    }}>
                                                        <Image src={item.image || "/products/grey.png"} alt={item.name} fill style={{ objectFit: "contain", padding: "10px" }} />
                                                    </Box>
                                                </Grid>

                                                <Grid size={{ xs: 8, sm: 9 }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 800, fontSize: { xs: "16px", md: "20px" }, textTransform: "uppercase" }}>
                                                                {item.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>{item.category || "Men's Shoes"}</Typography>
                                                            <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>Size: {item.size || "UK 10"}</Typography>

                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                <Stack direction="row" alignItems="center" sx={{ border: "1px solid #eee", borderRadius: "8px", px: 1 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleUpdateQty(item.productId, item.quantity, -1)}
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <RemoveIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <Typography sx={{ mx: 2, fontWeight: 600 }}>{item.quantity}</Typography>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleUpdateQty(item.productId, item.quantity, 1)}
                                                                    >
                                                                        <AddIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Stack>
                                                                <IconButton onClick={() => handleRemove(item.productId, item.name)} color="error" size="small">
                                                                    <DeleteOutlineIcon />
                                                                </IconButton>
                                                            </Stack>
                                                        </Box>

                                                        <Typography sx={{ fontWeight: 800, fontSize: "18px" }}>
                                                            ${item.price.toFixed(2)}
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                            <Divider sx={{ mt: 4, borderColor: "#f5f5f5" }} />
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ py: 10, textAlign: "center" }}>
                                    <Typography variant="h6" color="text.secondary">Your bag is empty.</Typography>
                                    <Button component={NextLink} href="/" sx={{ mt: 2, color: "#000", fontWeight: 700 }}>Go shopping</Button>
                                </Box>
                            )}
                        </Grid>

                        {/* Summary */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{
                                bgcolor: "#f9f9f9",
                                p: 4,
                                borderRadius: "24px",
                                position: "sticky",
                                top: 100
                            }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, textTransform: "uppercase", fontStyle: "italic" }}>Summary</Typography>

                                <Stack spacing={2} sx={{ mb: 4 }}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography color="text.secondary">Subtotal</Typography>
                                        <Typography sx={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography color="text.secondary">Estimated Shipping & Handling</Typography>
                                        <Typography sx={{ fontWeight: 600 }}>${shipping.toFixed(2)}</Typography>
                                    </Stack>
                                    <Divider sx={{ my: 1 }} />
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>${total.toFixed(2)}</Typography>
                                    </Stack>
                                </Stack>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: "#000",
                                        color: "#fff",
                                        height: "64px",
                                        borderRadius: "32px",
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        mb: 2,
                                        "&:hover": { bgcolor: "#333" }
                                    }}
                                >
                                    Checkout
                                </Button>

                                <Typography variant="caption" sx={{ color: "#aaa", textAlign: "center", display: "block" }}>
                                    Taxes calculated at checkout
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </main>

            <Footer />
        </Box>
    );
};

export default CartPage;
