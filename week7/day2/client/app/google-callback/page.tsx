'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Box, CircularProgress, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { apiSlice } from '@/store/apiSlice';

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (token) {
            // Set the token that came from the backend redirect
            Cookies.set('token', token, { expires: 7 }); // 7 days

            // Force re-fetch of user profile so Navbar updates immediately
            dispatch(apiSlice.util.invalidateTags(['User']));

            toast.success('Successfully logged in with Google!');

            // Critical: wait a tick to ensure cookie is set before redirecting
            setTimeout(() => {
                router.replace('/dashboard');
            }, 500);
        } else if (error) {
            toast.error('Google login failed.');
            router.replace('/login');
        } else {
            // No token, no error -> just accessing page manually?
            router.replace('/login');
        }
    }, [searchParams, router, dispatch]);

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
        }}>
            <CircularProgress sx={{ color: '#73FDAA' }} />
            <Typography variant="h6" color="white">Completing secure login...</Typography>
        </Box>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GoogleCallbackContent />
        </Suspense>
    );
}
