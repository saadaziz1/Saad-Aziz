'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import BackgroundBlobs from '@/components/shared/BackgroundBlobs';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', py: 8 }}>

            <Container maxWidth="sm">
                <LoginForm />
            </Container>
        </Box>
    );
};

export default LoginPage;
