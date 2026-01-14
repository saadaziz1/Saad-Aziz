'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Link,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { signupSchema } from '@/lib/validations/auth';
import { useSignupMutation } from '@/store/apiSlice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const SignupForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [signup, { isLoading, error: serverError }] = useSignupMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    const onSubmit = async (data: any) => {
        try {
            // Exclude confirmPassword from dynamic data
            const { confirmPassword, ...signupData } = data;
            const result = await signup(signupData).unwrap();
            toast.success(result.message || 'Signup successful! Please log in.');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            const message = err?.data?.message || err?.message || 'Signup failed. Please try again.';
            toast.error(message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: 4,
                    background: 'rgba(10, 17, 32, 0.6)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(115, 253, 170, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(115, 253, 170, 0.15)',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#fff' }}>
                    Create Account
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Join Decentral and start your crypto journey
                </Typography>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google />}
                    onClick={handleGoogleLogin}
                    sx={{
                        mb: 4,
                        py: 1.5,
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        '&:hover': {
                            borderColor: 'primary.main',
                            background: 'rgba(115, 253, 170, 0.05)',
                        }
                    }}
                >
                    Sign up with Google
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                    <Typography variant="body2" sx={{ px: 2, color: 'rgba(255, 255, 255, 0.3)' }}>OR</Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            variant="outlined"
                            {...register('fullName')}
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                            autoComplete="name"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            autoComplete="email"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            autoComplete="new-password"
                        />
                    </Box>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Already have an account?{' '}
                    <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Log In
                    </Link>
                </Typography>
            </Paper>
        </motion.div>
    );
};

export default SignupForm;
