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
import { loginSchema } from '@/lib/validations/auth';
import { useLoginMutation } from '@/store/apiSlice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const LoginForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading, error: serverError }] = useLoginMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    const onSubmit = async (data: any) => {
        try {
            const result = await login(data).unwrap();
            Cookies.set('token', result.accessToken, { expires: 7 });
            toast.success('Login successful!');
            window.location.href = '/dashboard';
        } catch (err: any) {
            const message = err?.data?.message || err?.message || 'Login failed. Please check your credentials.';
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
                    Welcome Back
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Enter your credentials to access your account
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
                    Continue with Google
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
                            autoComplete="current-password"
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

                    <Box sx={{ textAlign: 'right', mb: 3 }}>
                        <Link href="#" sx={{ color: 'primary.main', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                            Forgot password?
                        </Link>
                    </Box>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            py: 1.5,
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Don't have an account?{' '}
                    <Link href="/signup" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Sign Up
                    </Link>
                </Typography>
            </Paper>
        </motion.div>
    );
};

export default LoginForm;
