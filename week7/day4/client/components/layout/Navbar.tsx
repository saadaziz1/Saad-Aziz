"use client";

import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
    Drawer,
    Box,
    Container,
    Stack,
    IconButton,
    Typography,
    Button,
    Link
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useGetCartQuery } from "@/redux/features/cart/cartApi";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { Badge } from "@mui/material";

const categories = ["ALL", "WOMAN", "MEN", "WORCOUT", "RUN", "FOOTBALL"];

export const Navbar = () => {
    const [active, setActive] = useState("ALL");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: cartData } = useGetCartQuery(undefined, {
        skip: !isAuthenticated || !isMounted
    });

    const cartCount = isMounted && cartData?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        setMobileOpen(false);
    };

    return (
        <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee", px: { xs: 2, md: 6 } }}>
            <Container maxWidth="xl">
                <Stack
                    direction="row"
                    height={79}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ position: "relative" }}
                >
                    {/* Hamburger Menu (Mobile Only) */}
                    <Box sx={{ display: { xs: "block", md: "none" }, zIndex: 10 }}>
                        <IconButton onClick={handleDrawerToggle} color="inherit">
                            {mobileOpen ? <CloseIcon sx={{ fontSize: "30px" }} /> : <MenuIcon sx={{ fontSize: "30px" }} />}
                        </IconButton>
                    </Box>

                    {/* Left navigation (Desktop Only) */}
                    <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
                        {["WOMAN", "MEN", "ALL"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                underline="none"
                                onClick={() => setActive(item)}
                                sx={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: active === item ? 700 : 400,
                                    borderBottom: active === item ? "2px solid #000" : "2px solid transparent",
                                    pb: 0.5,
                                    transition: "all 0.25s ease",
                                    cursor: "pointer",
                                    "&:hover": { borderBottom: "2px solid #000" },
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </Stack>

                    {/* Logo */}
                    <Box
                        component={NextLink}
                        href="/"
                        sx={{
                            cursor: "pointer",
                            position: { xs: "absolute", md: "relative" },
                            left: { xs: "50%", md: "auto" },
                            transform: { xs: "translateX(-50%)", md: "none" },
                            zIndex: 5,
                            textDecoration: "none",
                            color: "inherit"
                        }}
                    >
                        <Typography sx={{
                            fontSize: "clamp(20px, 5vw, 32px)",
                            fontWeight: 300,
                            letterSpacing: "0.1em",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            YOUR<span style={{ fontWeight: 700 }}>SNEAKER</span>
                        </Typography>
                    </Box>

                    {/* Right side section */}
                    <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center" sx={{ zIndex: 10 }}>
                        {isMounted && isAuthenticated ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <IconButton size="small" sx={{ display: { xs: "none", md: "inline-flex" } }}>
                                    <SearchIcon sx={{ fontSize: "30px", color: "#000" }} />
                                </IconButton>
                                <IconButton
                                    component={NextLink}
                                    href="/cart"
                                    size="small"
                                >
                                    <Badge badgeContent={cartCount} color="error">
                                        <ShoppingBagOutlinedIcon sx={{ fontSize: "30px", color: "#000" }} />
                                    </Badge>
                                </IconButton>
                                <Button
                                    onClick={handleLogout}
                                    sx={{
                                        display: { xs: "none", md: "inline-flex" },
                                        color: "#000",
                                        fontWeight: 800,
                                        fontSize: "14px",
                                        letterSpacing: "1px",
                                        ml: 1
                                    }}
                                >
                                    LOGOUT
                                </Button>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
                                <Button
                                    component={NextLink}
                                    href="/login"
                                    sx={{ color: "#000", fontWeight: 700, letterSpacing: "1px" }}
                                >
                                    LOGIN
                                </Button>
                                <Button
                                    component={NextLink}
                                    href="/signup"
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#000",
                                        color: "#fff",
                                        borderRadius: "20px",
                                        px: 3,
                                        fontWeight: 700,
                                        letterSpacing: "1px",
                                        "&:hover": { bgcolor: "#333" }
                                    }}
                                >
                                    SIGN UP
                                </Button>
                            </Stack>
                        )}

                        {/* Mobile Cart Icon (Only if authenticated) */}
                        {isMounted && isAuthenticated && (
                            <IconButton
                                component={NextLink}
                                href="/cart"
                                size="small"
                                sx={{ display: { xs: "flex", md: "none" } }}
                            >
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingBagOutlinedIcon sx={{ fontSize: "30px", color: "#000" }} />
                                </Badge>
                            </IconButton>
                        )}
                    </Stack>
                </Stack>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                disableScrollLock
                PaperProps={{
                    sx: {
                        width: "100%",
                        height: "100%",
                        bgcolor: "#fff",
                        p: 0,
                        boxShadow: "none"
                    },
                }}
            >
                <Container maxWidth="xl" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ px: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 79 }}>
                            <IconButton onClick={handleDrawerToggle}>
                                <CloseIcon sx={{ fontSize: "32px", color: "#000" }} />
                            </IconButton>
                            <Typography
                                component={NextLink}
                                href="/"
                                onClick={() => setMobileOpen(false)}
                                sx={{
                                    fontSize: "24px",
                                    fontWeight: 300,
                                    letterSpacing: "0.1em",
                                    textDecoration: "none",
                                    color: "inherit"
                                }}
                            >
                                YOUR<span style={{ fontWeight: 700 }}>SNEAKER</span>
                            </Typography>
                            <IconButton
                                component={NextLink}
                                href="/cart"
                                onClick={() => setMobileOpen(false)}
                                size="small"
                            >
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingBagOutlinedIcon sx={{ fontSize: "32px", color: "#000" }} />
                                </Badge>
                            </IconButton>
                        </Stack>
                    </Box>

                    <Stack spacing={4} sx={{ px: 4, mt: 4, flexGrow: 1 }}>
                        {/* Mobile SEARCH Link */}
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ cursor: "pointer" }}>
                            <SearchIcon sx={{ fontSize: "45px", color: "#000" }} />
                            <Typography sx={{ fontSize: "28px", fontWeight: 300, color: "#aaa", letterSpacing: "0.1em" }}>SEARCH</Typography>
                        </Stack>

                        {/* Mobile Auth Links */}
                        {isMounted && isAuthenticated ? (
                            <Stack
                                direction="row"
                                spacing={3}
                                alignItems="center"
                                sx={{ cursor: "pointer" }}
                                onClick={handleLogout}
                            >
                                <PersonOutlineIcon sx={{ fontSize: "40px", color: "#000" }} />
                                <Typography sx={{ fontSize: "24px", fontWeight: 800, letterSpacing: "0.1em" }}>LOGOUT</Typography>
                            </Stack>
                        ) : (
                            <Stack spacing={2} sx={{ mb: 2 }}>
                                <Button
                                    component={NextLink}
                                    href="/login"
                                    fullWidth
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        color: "#000",
                                        height: "60px",
                                        border: "2px solid #000",
                                        borderRadius: "30px",
                                        fontSize: "18px",
                                        fontWeight: 800,
                                        letterSpacing: "2px"
                                    }}
                                >
                                    LOGIN
                                </Button>
                                <Button
                                    component={NextLink}
                                    href="/signup"
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        bgcolor: "#000",
                                        color: "#fff",
                                        height: "60px",
                                        borderRadius: "30px",
                                        fontSize: "18px",
                                        fontWeight: 800,
                                        letterSpacing: "2px",
                                        "&:hover": { bgcolor: "#333" }
                                    }}
                                >
                                    SIGN UP
                                </Button>
                            </Stack>
                        )}

                        {/* Mobile Navigation Links */}
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {categories.map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="none"
                                    onClick={() => { setActive(item); setMobileOpen(false); }}
                                    sx={{
                                        color: "#000",
                                        fontSize: "30px",
                                        fontWeight: active === item ? 700 : 400,
                                        position: "relative",
                                        display: "inline-block",
                                        width: "fit-content",
                                        "&::after": active === item ? {
                                            content: '""',
                                            position: "absolute",
                                            bottom: -4,
                                            left: 0,
                                            width: "100%",
                                            height: "4px",
                                            bgcolor: "#000"
                                        } : {}
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Stack>

                    {/* Footer Logo in Drawer */}
                    <Box sx={{ pb: 8, textAlign: "center", opacity: 0.1 }}>
                        <Image src="/home/nike.png" alt="Nike" width={300} height={120} style={{ objectFit: "contain" }} />
                    </Box>
                </Container>
            </Drawer>
        </Box>
    );
};
