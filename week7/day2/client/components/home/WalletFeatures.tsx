'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BackgroundBlobs from '../shared/BackgroundBlobs';

const features = [
    {
        title: 'Secure Token Market',
        desc: 'The easy to manage and trade your cryptocurrency asset.',
    },
    {
        title: 'User Friendly Interface',
        desc: 'The easy to manage and trade your cryptocurrency asset.',
    },
    {
        title: 'Token with Token control',
        desc: 'The easy to manage and trade your cryptocurrency asset.',
    },
];

const WalletFeatures = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 12 }, position: 'relative', maxWidth: 1321, mx: 'auto', px: { xs: 2, md: 0 } }}>

            <div className="absolute z-0 inset-y-1/3 inset-x-20 bg-[#73FDAA] hidden sm:block w-32 h-32 rounded-full blur-2xl "></div>

            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" sx={{ zIndex: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'

                        }}

                    >
                        <Image
                            src="/home/features.png"
                            alt="Wallet Features"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: { xs: 'left', md: 'right' } }}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                viewport={{ once: true }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, md: 3.5 },
                                        pl: { xs: 2.5, md: 4 },
                                        background: 'linear-gradient(270deg, #73FDAAE3 0%, #A0BFB780 50%, transparent 100%)',
                                        borderRadius: 3,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        width: '100%',
                                        maxWidth: { xs: '100%', md: 698 },
                                        cursor: 'pointer',
                                        ml: { xs: 0, md: -12 },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 700,
                                            fontSize: { xs: '1rem', md: '1.25rem' },
                                            color: '#FFFFFF',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.85)',
                                            fontWeight: 400,
                                            fontSize: { xs: '0.85rem', md: '0.95rem' },
                                            lineHeight: 1.7,
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        {feature.desc}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default WalletFeatures;
