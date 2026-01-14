'use client';

import React, { useMemo } from 'react';
import { Paper, Box, Typography, useTheme, IconButton } from '@mui/material';
import Image from 'next/image';
import { ArrowOutward } from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CryptoCardProps {
    name: string;
    symbol: string;
    price: string;
    change: string;
    isUp: boolean;
    icon: string | React.ReactNode;
}

// Generate realistic crypto price data based on actual price and change
const generateChartData = (isUp: boolean, symbol: string, price: string, change: string) => {
    const points = 24;
    const data = [];

    const currentPrice = parseFloat(price.replace(/[$,]/g, ''));
    const changePercent = parseFloat(change.replace('%', ''));

    const startPrice = currentPrice / (1 + changePercent / 100);

    // Insane crypto-like volatility
    const volatilityMap: Record<string, number> = {
        BTC: 0.04,
        ETH: 0.06,
        SOL: 0.12,
        DOGE: 0.18,
        ADA: 0.10,
        XRP: 0.11,
        BNB: 0.07,
        MATIC: 0.14,
    };

    const volatility = volatilityMap[symbol] || 0.1;

    let last = startPrice;

    for (let i = 0; i < points; i++) {
        const progress = i / (points - 1);

        // Strong drift toward real price
        const drift = (currentPrice - last) * 0.25;

        // Wild random swings
        const noise = (Math.random() - 0.5) * last * volatility;

        // Mega spikes (pump & dumps)
        const spikeChance = Math.random();
        let spike = 0;

        if (spikeChance > 0.9) {
            spike = last * volatility * (Math.random() > 0.5 ? 4 : -3.5);
        }

        // Whipsaw waves
        const wave = Math.sin(i * 0.9) * last * volatility * 0.8;

        const next = last + drift + noise + spike + wave;

        data.push({
            value: Math.max(next, startPrice * 0.3), // don’t go negative
            time: i,
        });

        last = next;
    }

    // Force last point to exactly match the real price
    data[data.length - 1].value = currentPrice;

    return data;
};


const CryptoCard = ({ name, symbol, price, change, isUp, icon }: CryptoCardProps) => {
    const theme = useTheme();

    // Memoize chart data to prevent regeneration on every render
    const chartData = useMemo(() => generateChartData(isUp, symbol, price, change), [isUp, symbol, price, change]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                mb: 2.5,
                mx: 0.25,
                background: '#010010',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #fff',
                boxShadow: "0 1px 6px 4px #73FDAAE3",
                '&:hover': {
                    borderColor: 'primary.main',
                    background: 'linear-gradient(135deg, rgba(22, 36, 61, 0.6) 0%, rgba(16, 25, 44, 0.8) 100%)',
                    transform: 'translateY(-4px)',
                    boxShadow: isUp
                        ? '0 12px 24px rgba(115, 253, 170, 0.15)'
                        : '0 12px 24px rgba(0, 0, 0, 0.3)',
                }
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {typeof icon === 'string' ? (
                            <Image src={icon} alt={symbol} width={50} height={50} style={{ objectFit: 'contain' }} />
                        ) : (
                            icon
                        )}
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            fontSize: '18px',
                            letterSpacing: '0',
                        }}
                    >
                        {symbol}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            backgroundColor: '#B6B6B64D',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '2px 5px',
                            borderRadius: '5px'
                        }}
                    >
                        {name}
                    </Typography>
                </Box>
                <IconButton color="inherit" size="small">
                    <ArrowOutward sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>

            {/* Price and Chart */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            fontSize: '24px',
                            mb: 0.5,
                            letterSpacing: '0'
                        }}
                    >
                        {price}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#fff",
                            fontSize: '18px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        {change}
                    </Typography>
                </Box>

                {/* Dynamic Mini Chart with Real Data */}
                <Box sx={{ width: 100, height: 45 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <defs>
                                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="0%"
                                        stopColor={isUp ? theme.palette.primary.main : '#EF4444'}
                                        stopOpacity={0.5}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={isUp ? theme.palette.primary.main : '#EF4444'}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={isUp ? theme.palette.primary.main : '#EF4444'}
                                strokeWidth={2.5}
                                dot={false}
                                fill={`url(#gradient-${symbol})`}
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Paper>
    );
};

export default CryptoCard;
