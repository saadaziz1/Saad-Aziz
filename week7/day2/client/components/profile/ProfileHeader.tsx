'use client';

import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/apiSlice';

const ProfileHeader = () => {
    const { data: user, isLoading: isFetching } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', picture: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                picture: user.picture || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            await updateProfile(formData).unwrap();
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    if (isFetching) return <CircularProgress />;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Avatar
                src={user?.picture}
                sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    boxShadow: '0 0 20px rgba(115, 253, 170, 0.3)',
                }}
            >
                {user?.firstName?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, width: '100%' }}>
                {isEditing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: { xs: 'auto', sm: 0 } }}>
                        <TextField
                            size="small"
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            variant="outlined"
                        />
                        <TextField
                            size="small"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
                        />
                        <TextField
                            size="small"
                            label="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
                        />
                        <TextField
                            size="small"
                            label="Profile Picture URL"
                            value={formData.picture}
                            onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <Save />}
                                onClick={handleSave}
                                disabled={isUpdating}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Cancel />}
                                onClick={() => setIsEditing(false)}
                                color="inherit"
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 0.5, letterSpacing: '-0.02em' }}>
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 500, opacity: 0.8, mb: 3 }}>{user?.email}</Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Edit />}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 4,
                                    boxShadow: '0 8px 16px rgba(115, 253, 170, 0.2)',
                                }}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ProfileHeader;
