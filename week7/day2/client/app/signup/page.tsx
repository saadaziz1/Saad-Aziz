'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import BackgroundBlobs from '@/components/shared/BackgroundBlobs';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', py: 8 }}>

            <Container maxWidth="sm">
                <SignupForm />
            </Container>
        </Box>
    );
};

export default SignupPage;
