"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Link,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginSchema } from "@/lib/validations/auth";
import toast from "react-hot-toast";
import NextLink from "next/link";
import Image from "next/image";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const LoginPage = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const result = await login(data).unwrap();
            dispatch(setCredentials({ user: result.user, token: result.access_token }));
            toast.success("Successfully logged in!");
            router.push("/");
        } catch (err: any) {
            toast.error(err.data?.message || "Login failed");
        }
    };

    return (<><Navbar />
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f9f9f9",
                py: 4,
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: "24px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
                        textAlign: "center",
                    }}
                >
                    <Box sx={{ mb: 4, position: "relative", width: 60, height: 22, mx: "auto" }}>
                        <Image src="/home/Vector (2).png" alt="Nike Logo" fill style={{ objectFit: "contain" }} />
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 900, mb: 1, textTransform: "uppercase", fontStyle: "italic" }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
                        Enter your credentials to access your account
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                },
                            }}
                        />

                        <Box sx={{ textAlign: "right", mt: 1, mb: 2 }}>
                            <Link
                                component={NextLink}
                                href="#"
                                sx={{
                                    color: "#000",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                mt: 2,
                                mb: 3,
                                py: 1.5,
                                bgcolor: "#000",
                                color: "#fff",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: 700,
                                textTransform: "none",
                                "&:hover": { bgcolor: "#333" },
                            }}
                        >
                            {isLoading ? "Logging in..." : "Sign In"}
                        </Button>

                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Don't have an account?{" "}
                            <Link
                                component={NextLink}
                                href="/signup"
                                sx={{
                                    color: "#FF3939",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box><Footer /></>

    );
};

export default LoginPage;
