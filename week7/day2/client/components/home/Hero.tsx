'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BackgroundBlobs from '../shared/BackgroundBlobs';

const Hero = () => {
    return (
        <Box sx={{ position: 'relative', pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 12 } }}>

            <div className="absolute inset-0 bg-[#73FDAA] w-32 h-32 rounded-full blur-2xl "></div>

            <Grid sx={{ maxWidth: 1321, mx: 'auto', px: { xs: 2, md: 0 } }} container spacing={{ xs: 4, md: 6 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6.5 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                mb: { xs: 2, md: 1 },
                                fontWeight: 700,
                                fontSize: { xs: '2rem', sm: '3rem', md: '75px' },
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Save, Buy and Sell <br />
                            Your blockchain <br />
                            asset
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: { xs: 4, md: 5 },
                                pr: { xs: 0, md: 12 },
                                fontSize: { xs: '1.125rem', sm: '1.5rem', md: '36px' },
                                fontWeight: 400,
                                lineHeight: 1.3,
                            }}
                        >
                            The easy to manage and trade your cryptocurrency asset
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    px: 7,
                                    py: 1.75,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: 6,
                                    textTransform: 'none',
                                    '&:hover': {
                                        boxShadow: '0 12px 32px rgba(115, 253, 170, 0.35)',
                                    }
                                }}
                            >
                                Connect Wallet
                            </Button>
                            <Button
                                variant="contained"
                                color='secondary'
                                size="large"
                                sx={{
                                    px: 7,
                                    py: 1.75,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: 6,

                                    textTransform: 'none',
                                    '&:hover': {

                                        color: 'primary.main',
                                        backgroundColor: 'rgba(115, 253, 170, 0.05)'
                                    }
                                }}
                            >
                                Start Trading
                            </Button>
                        </Box>
                    </motion.div>
                </Grid>

                <Grid size={{ xs: 12, md: 5.5 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '550px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Image
                            src="/home/hero.png"
                            alt="Blockchain Asset"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                            className="z-1"
                        />
                        <div className="absolute inset-x-1/2 bg-[#73FDAA] -bottom-5 w-32 h-32 rounded-full blur-2xl z-0 "></div>
                    </motion.div>
                </Grid>
            </Grid>
        </Box >
    );
};

export default Hero;
