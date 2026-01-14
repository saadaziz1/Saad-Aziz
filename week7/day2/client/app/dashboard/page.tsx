'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

import StatCards from '@/components/dashboard/StatCards';
import TransactionTable from '@/components/dashboard/TransactionTable';

const DashboardPage = () => {
    return (
        <Box sx={{ minHeight: '100vh', py: 12, position: 'relative' }}>


            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Dashboard Overview</Typography>
                        <Typography variant="body1" color="text.secondary">Welcome back to your blockchain portal</Typography>
                    </Box>
                </Box>

                <StatCards />
                <TransactionTable />
            </Container>
        </Box>
    );
};

export default DashboardPage;
