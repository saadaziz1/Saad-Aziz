'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import CryptoCard from '../shared/CryptoCard';
import { motion } from 'framer-motion';

const cryptoData = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$42,351.00', change: '2.5%', isUp: true, icon: "/market/btc.png" },
    { name: 'Ethereum', symbol: 'ETH', price: '$2,251.00', change: '1.2%', isUp: true, icon: "/market/ethereum.png" },
    { name: 'Binance', symbol: 'BNB', price: '$0.51', change: '0.5%', isUp: false, icon: "/market/binance.png" },
    { name: 'Tether', symbol: 'USDT', price: '$95.00', change: '4.2%', isUp: true, icon: "/market/usdt.png" },

    { name: 'Bitcoin', symbol: 'BTC', price: '$42,351.00', change: '2.5%', isUp: true, icon: "/market/btc.png" },
    { name: 'Ethereum', symbol: 'ETH', price: '$2,251.00', change: '1.2%', isUp: true, icon: "/market/ethereum.png" },
    { name: 'Binance', symbol: 'BNB', price: '$0.51', change: '0.5%', isUp: false, icon: "/market/binance.png" },
    { name: 'Tether', symbol: 'USDT', price: '$95.00', change: '4.2%', isUp: true, icon: "/market/usdt.png" },

    { name: 'Bitcoin', symbol: 'BTC', price: '$42,351.00', change: '2.5%', isUp: true, icon: "/market/btc.png" },
    { name: 'Ethereum', symbol: 'ETH', price: '$2,251.00', change: '1.2%', isUp: true, icon: "/market/ethereum.png" },
    { name: 'Binance', symbol: 'BNB', price: '$0.51', change: '0.5%', isUp: false, icon: "/market/binance.png" },
    { name: 'Tether', symbol: 'USDT', price: '$95.00', change: '4.2%', isUp: true, icon: "/market/usdt.png" },

    { name: 'Bitcoin', symbol: 'BTC', price: '$42,351.00', change: '2.5%', isUp: true, icon: "/market/btc.png" },
    { name: 'Ethereum', symbol: 'ETH', price: '$2,251.00', change: '1.2%', isUp: true, icon: "/market/ethereum.png" },
    { name: 'Binance', symbol: 'BNB', price: '$0.51', change: '0.5%', isUp: false, icon: "/market/binance.png" },
    { name: 'Tether', symbol: 'USDT', price: '$95.00', change: '4.2%', isUp: true, icon: "/market/usdt.png" },
];

const MarketTrend = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 12 }, position: 'relative', maxWidth: 1321, mx: 'auto', px: { xs: 2, md: 0 } }}>

            <Typography
                variant="h3"
                sx={{
                    mb: { xs: 3, md: 5 },
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '48px' },
                    letterSpacing: '0',
                }}
            >
                Market Trend
            </Typography>

            <Grid container spacing={2.5}>
                {cryptoData.map((crypto, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`${crypto.symbol}-${index}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: (index % 4) * 0.1,
                                ease: 'easeOut'
                            }}
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <CryptoCard {...crypto} />
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box >
    );
};

export default MarketTrend;
