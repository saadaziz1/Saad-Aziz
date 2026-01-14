'use client';

import React from 'react';
import { Box, Container, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSettings from '@/components/profile/ProfileSettings';

const ProfilePage = () => {
    return (
        <Box sx={{ minHeight: '100vh', py: 12, position: 'relative' }}>


            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 8 },
                            borderRadius: 6,
                            background: 'rgba(10, 17, 32, 0.7)',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid rgba(115, 253, 170, 0.1)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                            mb: 4,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #73FDAA 0%, #4facfe 100%)',
                            }
                        }}
                    >
                        <ProfileHeader />
                        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                        <ProfileSettings />
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ProfilePage;
