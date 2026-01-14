'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const FeatureBanner = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center', position: 'relative', px: { xs: 2, md: 0 } }}>
            <div className="absolute z-0 inset-x-1/4 top-0 bg-[#73FDAA] w-32 h-32 rounded-full blur-2xl hidden sm:block"></div>
            <Container sx={{ zIndex: 1 }} >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '48px' },
                            mb: 2.5,
                            lineHeight: 1.2,
                            letterSpacing: '0',
                            zIndex: 1
                        }}
                    >
                        Global Decentralize currency based on <br />
                        Blockchain technology
                    </Typography>

                    <Typography
                        component="a"
                        href="#"
                        sx={{
                            color: "primary.main",
                            fontSize: { xs: '16px', md: '20px' },
                            cursor: 'pointer',
                            fontWeight: 500,
                            display: 'inline-block',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                opacity: 0.8,
                                textDecorationColor: 'primary.main'
                            },
                            zIndex: 1
                        }}
                    >
                        Web3 is the latest efficient technology
                    </Typography>
                </motion.div>
            </Container>
        </Box>
    );
};

export default FeatureBanner;
