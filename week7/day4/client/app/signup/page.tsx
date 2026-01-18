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
    Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signupSchema } from "@/lib/validations/auth";
import toast from "react-hot-toast";
import NextLink from "next/link";
import Image from "next/image";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SignupPage = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [registerMutation, { isLoading }] = useRegisterMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const { confirmPassword, ...registerData } = data;
            const result = await registerMutation(registerData).unwrap();
            dispatch(setCredentials({ user: result.user, token: result.access_token }));
            toast.success("Account created successfully!");
            router.push("/");
        } catch (err: any) {
            toast.error(err.data?.message || "Registration failed");
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
                py: 6,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: "32px",
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
                        Join the Movement
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
                        Create your account to start your journey with Nike
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    {...register("name")}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "12px",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    autoComplete="email"
                                    {...register("email")}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "12px",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
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
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                mt: 4,
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
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>

                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Already have an account?{" "}
                            <Link
                                component={NextLink}
                                href="/login"
                                sx={{
                                    color: "#FF3939",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
        <Footer /></>
    );
};

export default SignupPage;
