'use client';

import React from 'react';
import { Box, Typography, Container, IconButton, Divider, Link } from '@mui/material';
import Grid from '@mui/material/Grid';

import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';

const Footer = () => {
    return (
        <Box sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 4, md: 6 },
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            boxShadow: '5px 1px 13px 4px rgba(115, 253, 170, 0.48)',
            borderTop: '1px solid rgba(115, 253, 170, 0.25)',
        }}>
            <Container>
                <Grid container spacing={{ xs: 4, md: 8 }}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Image src="/home/Logo.png" alt="logo" width={200} height={45} />
                        </Box>
                        <Typography variant="body2" color="#fff" sx={{ mb: 4, maxWidth: 400, fontSize: { xs: '14px', md: '20px' }, fontWeight: { xs: 500, md: 700 } }}>
                            Amet minim mollit non deserunt ullamco est aliqua dolor do amet sint. Velit officia consequatduis enim velit mollit. Exercitation veniamconsequat sunt nostrud amet. </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', md: '36px' } }}>Quick Link</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Link href="#" underline="none" color="#fff" sx={{ fontWeight: 500, fontSize: { xs: '14px', md: '20px' }, '&:hover': { color: 'primary.main' } }}>Free Course</Link>
                            <Link href="#" underline="none" color="#fff" sx={{ fontWeight: 500, fontSize: { xs: '14px', md: '20px' }, '&:hover': { color: 'primary.main' } }}>Blog</Link>
                            <Link href="#" underline="none" color="#fff" sx={{ fontWeight: 500, fontSize: { xs: '14px', md: '20px' }, '&:hover': { color: 'primary.main' } }}>Support</Link>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: { xs: 2, md: 4 }, fontSize: { xs: '1.5rem', md: '36px' } }}>Social Media</Typography>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <IconButton color="inherit" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(115, 253, 170, 0.1)' } }}><TwitterIcon /></IconButton>
                            <IconButton color="inherit" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(115, 253, 170, 0.1)' } }}><InstagramIcon /></IconButton>
                            <IconButton color="inherit" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(115, 253, 170, 0.1)' } }}><LinkedInIcon /></IconButton>
                            <IconButton color="inherit" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(115, 253, 170, 0.1)' } }}><GitHubIcon /></IconButton>
                        </Box>
                    </Grid>
                </Grid>


                <Box sx={{ textAlign: { xs: 'center', md: 'center' }, marginTop: { xs: 4, md: 5 } }}>
                    <Typography variant="caption" color="#fff" sx={{ letterSpacing: 1, fontWeight: 500, fontSize: { xs: '12px', md: '20px' }, color: '#fff' }}>
                        © {new Date().getFullYear()} Circlechain
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
