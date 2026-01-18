"use client";

import { Box, Typography, IconButton, Card, Stack } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import NextLink from "next/link";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const SneakerCard = ({ product }: { product: any }) => {
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to add to cart");
            router.push("/login");
            return;
        }

        try {
            await addToCart(product.id).unwrap();
            toast.success("Added to cart!");
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to add to cart");
        }
    };

    return (
        <Card
            component={NextLink}
            href={`/products/${product.id}`}
            sx={{
                height: { xs: 480, md: 580 },
                width: "100%",
                boxShadow: "none",
                bgcolor: "#EFEFEF",
                borderRadius: '18px',
                position: "relative",
                overflow: "visible",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                "&:hover": { bgcolor: "#eee" }
            }}
        >
            <Box sx={{
                height: { xs: 280, md: 350 },
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
                    transform: { xs: "rotate(90deg) translateX(50px)", md: "rotate(90deg) translateX(40px)" },
                    bottom: 10,
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
                    transform: { xs: "translateY(50px) translateX(-30px)", md: "translateY(-0px) translateX(-30px)" },
                    filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.5))"
                }}>
                    <Image
                        src={product.image || "/products/grey.png"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "contain" }}
                    />
                </Box>
            </Box>

            {/* Card Content: Mobile (Matches Mockup) */}
            <Box sx={{ display: { xs: "block", md: "none" }, px: 2.5, pb: 2.5, mt: "auto" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: "20px", lineHeight: 1.1, mb: 0.5 }}>{product.name}</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#555" }}>{product.price}</Typography>
                    </Box>
                    <IconButton
                        size="small"
                        disabled={isLoading}
                        onClick={handleQuickAdd}
                        sx={{ bgcolor: "#fff", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", p: 1.5 }}
                    >
                        <ShoppingCartOutlinedIcon sx={{ fontSize: "24px", color: "#000" }} />
                    </IconButton>
                </Stack>
            </Box>

            {/* Card Content: Desktop (Original Premium Design) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", px: 4, pb: 4, mt: "auto" }}>
                <Typography sx={{ fontWeight: 900, fontSize: "40px", mb: 0.5 }}>{product.name}</Typography>
                <Typography sx={{ fontWeight: 400, fontSize: "20px", mb: 2 }}>{product.price}</Typography>
                <IconButton
                    size="small"
                    disabled={isLoading}
                    onClick={handleQuickAdd}
                    sx={{
                        bgcolor: "#fff",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                        p: 2,
                        alignSelf: "flex-end",
                        "&:hover": { bgcolor: "#f5f5f5" }
                    }}
                >
                    <ShoppingCartOutlinedIcon sx={{ fontSize: "28px", color: "#000" }} />
                </IconButton>
            </Box>
        </Card>
    );
};
