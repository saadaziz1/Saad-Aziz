'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
            }}
        >
            <CircularProgress
                size={60}
                sx={{
                    color: '#73FDAA',
                }}
            />
        </Box>
    );
}
