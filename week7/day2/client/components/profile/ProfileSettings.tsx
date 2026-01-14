'use client';

import React from 'react';
import { Grid, Typography, TextField, Button, Paper, Box, Skeleton, Avatar } from '@mui/material';
import { Security, Save, AccountBalanceWallet, Notifications } from '@mui/icons-material';
import { useGetProfileQuery } from '@/store/apiSlice';

const ProfileSettings = () => {
    const { data: user, isLoading } = useGetProfileQuery();

    if (isLoading) {
        return (
            <Grid container spacing={3}>
                {[1, 2].map((i) => (
                    <Grid key={i} size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                height: '200px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: 3,
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Skeleton variant="rectangular" width="100%" height={48} sx={{ mb: 2, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                            <Skeleton variant="rectangular" width="100%" height={48} sx={{ mb: 3, borderRadius: 1, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                            <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                        <Security fontSize="small" color="primary" /> Security Settings
                    </Typography>
                    <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(115, 253, 170, 0.2)',
                        }}
                    >
                        Update Password
                    </Button>
                </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                            <AccountBalanceWallet fontSize="small" color="primary" /> Profile & Wallet
                        </Typography>

                        {/* User Info Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                            <Avatar
                                src={user?.picture}
                                sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 600 }}
                            >
                                {user?.firstName?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>
                                    {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                    {user?.email}
                                </Typography>
                            </Box>
                        </Box>

                        <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Connected Wallet</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5, color: 'primary.main', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                                0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                            </Typography>
                        </Paper>
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                            <Notifications fontSize="small" color="primary" /> Notifications
                        </Typography>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Notifications />}
                            sx={{
                                justifyContent: 'flex-start',
                                borderRadius: 2,
                                py: 1.5,
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'rgba(115, 253, 170, 0.05)',
                                }
                            }}
                        >
                            Email Notifications: On
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ProfileSettings;
