'use client';

import React from 'react';
import { Grid, Card, CardContent, Box, Avatar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { AccountBalanceWallet, TrendingUp, SwapHoriz } from '@mui/icons-material';

const stats = [
    { title: 'Total Balance', value: '$45,231.89', icon: <AccountBalanceWallet color="primary" />, trend: '+12.5%' },
    { title: 'Portfolio Value', value: '$38,102.45', icon: <TrendingUp color="primary" />, trend: '+8.2%' },
    { title: 'Monthly Swaps', value: '156', icon: <SwapHoriz color="primary" />, trend: '+24%' },
];

const StatCards = () => {
    return (
        <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 4
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(115, 253, 170, 0.1)', color: 'primary.main' }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                        {stat.trend}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{stat.title}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
};

export default StatCards;
