'use client';

import React from 'react';
import { Box, Typography, Container, TextField, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNewsletter } from '@/hooks/useNewsletter';

const Newsletter = () => {
    const { email, setEmail, handleSubscribe, isLoading, message } = useNewsletter();

    return (
        <Box sx={{ py: { xs: 8, md: 15 }, position: 'relative' }}>
            <Container maxWidth="lg" sx={{ zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            maxWidth: 1019,
                            height: { xs: 'auto', md: 259 },
                            minHeight: 259,
                            mx: 'auto',
                            px: { xs: 3, md: 6 },
                            py: { xs: 4, md: 6 },
                            borderRadius: '10px',
                            background: 'rgba(1, 0, 16, 0.61)',
                            backdropFilter: 'blur(5px)',
                            WebkitBackdropFilter: 'blur(5px)',
                            boxShadow: '5px 1px 13px 4px rgba(115, 253, 170, 0.48)',
                            border: '1px solid rgba(115, 253, 170, 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                mb: 2,
                                fontWeight: 700,
                                fontSize: { xs: '2rem', md: '48px' },
                                color: '#fff'
                            }}
                        >
                            Ready to get started?
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 6,
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: { xs: '1rem', md: '1.25rem' }
                            }}
                        >
                            Join our newsletter to stay up to date with the latest crypto trends
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubscribe}
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                position: 'relative',
                                zIndex: 1,
                                maxWidth: 600,
                                mx: 'auto',
                                width: '100%',
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Enter your email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '8px',
                                        height: 48,
                                        fontSize: '14px',
                                        color: '#111',
                                    },
                                    '& input': {
                                        color: '#111',
                                    },
                                    '& input::placeholder': {
                                        color: '#6B7280',
                                        opacity: 1,
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                sx={{
                                    height: 48,
                                    px: 4,
                                    borderRadius: '8px',
                                    background: '#73FDAA',
                                    color: '#000',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    minWidth: { xs: '100%', sm: 'auto' },
                                    boxShadow: '0 0 20px rgba(115,253,170,0.7)',
                                    '&:hover': {
                                        background: '#5EE095',
                                    },
                                }}
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </Button>
                        </Box>

                        {message && (
                            <Typography
                                sx={{
                                    mt: 2,
                                    color: message.type === 'success' ? 'primary.main' : 'error.main',
                                    fontWeight: 500
                                }}
                            >
                                {message.text}
                            </Typography>
                        )}
                    </Paper>
                </motion.div>
            </Container>

            <div className="absolute z-0 top-10 right-64 bg-[#73FDAA] w-32 h-32 rounded-full blur-2xl md:block hidden"></div>
            <div className="absolute z-0 top-60 left-64 bg-[#73FDAA] w-32 h-32 rounded-full blur-2xl md:block hidden"></div>
        </Box>
    );
};

export default Newsletter;
