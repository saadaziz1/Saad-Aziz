'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Container,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Facebook,
    Instagram,
    LinkedIn,
    Telegram,
    Login as LoginIcon,
    Logout,
    Dashboard as DashboardIcon,
    Person as PersonIcon
} from '@mui/icons-material';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery, apiSlice } from '@/store/apiSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

const Navbar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: user, isLoading } = useGetProfileQuery();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const navItems = [
        { label: 'How it Works', path: '/' },
        { label: 'Blog', path: '/' },
        { label: 'Support', path: '/' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        dispatch(apiSlice.util.resetApiState());
        handleProfileMenuClose();
        router.push('/login');
        router.refresh();
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', height: '100%', }}>
            <Image src="/home/Logo.png" alt='logo' width={256} height={58} />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <Button color="inherit" component={Link} href={item.path} sx={{ width: '100%', color: 'text.primary', textTransform: 'none' }}>
                            <ListItemText primary={item.label} />
                        </Button>
                    </ListItem>
                ))}
                {user ? (
                    <>
                        <ListItem disablePadding>
                            <Button color="inherit" component={Link} href="/dashboard" sx={{ width: '100%', color: 'text.primary', textTransform: 'none' }}>
                                <ListItemText primary="Dashboard" />
                            </Button>
                        </ListItem>
                        <ListItem disablePadding>
                            <Button color="inherit" component={Link} href="/profile" sx={{ width: '100%', color: 'text.primary', textTransform: 'none' }}>
                                <ListItemText primary="Profile" />
                            </Button>
                        </ListItem>
                        <ListItem disablePadding>
                            <Button color="error" onClick={handleLogout} sx={{ width: '100%', textTransform: 'none' }}>
                                <ListItemText primary="Logout" />
                            </Button>
                        </ListItem>
                    </>
                ) : (
                    <ListItem disablePadding>
                        <Button
                            color="primary"
                            variant="contained"
                            component={Link}
                            href="/login"
                            sx={{ width: '100%', mt: 2, borderRadius: 2 }}
                        >
                            Login
                        </Button>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ py: 8, maxWidth: 1321, mx: "auto", }} >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, }}>
                    <Link href="/">
                        <Image src="/home/Logo.png" alt="logo" width={256} height={58} />
                    </Link>

                    {!isMobile && (
                        <Box sx={{ display: "flex", alignItems: "center", fontSize: "24px" }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    href={item.path}
                                    sx={{
                                        color: "text.primary",
                                        fontWeight: 500,
                                        fontSize: '24px',
                                        textTransform: "none",
                                        "&:hover": { color: "primary.main" },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!isMobile && (
                        <>
                            <Box sx={{ mr: 2 }}>
                                <IconButton color="inherit"><Instagram sx={{ fontSize: 30 }} /></IconButton>
                                <IconButton color="inherit"><Facebook sx={{ fontSize: 30 }} /></IconButton>
                                <IconButton color="inherit"><LinkedIn sx={{ fontSize: 30 }} /></IconButton>
                                <IconButton color="inherit"><Telegram sx={{ fontSize: 30 }} /></IconButton>
                            </Box>

                            {!isLoading && (
                                user ? (
                                    <>
                                        <IconButton
                                            onClick={handleProfileMenuOpen}
                                            sx={{ p: 0.5, border: '2px solid', borderColor: 'primary.main' }}
                                        >
                                            <Avatar
                                                src={user.picture}
                                                alt={user.firstName}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                {user.firstName?.charAt(0)}
                                            </Avatar>
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleProfileMenuClose}
                                            PaperProps={{
                                                sx: {
                                                    mt: 1.5,
                                                    bgcolor: '#0a1120',
                                                    border: '1px solid rgba(115, 253, 170, 0.2)',
                                                    color: '#fff',
                                                    minWidth: 180,
                                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                                                }
                                            }}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <Box sx={{ px: 2, py: 1.5 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                                            <MenuItem component={Link} href="/dashboard" onClick={handleProfileMenuClose} sx={{ py: 1.2 }}>
                                                <ListItemIcon><DashboardIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                                                Dashboard
                                            </MenuItem>
                                            <MenuItem component={Link} href="/profile" onClick={handleProfileMenuClose} sx={{ py: 1.2 }}>
                                                <ListItemIcon><PersonIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                                                Profile
                                            </MenuItem>
                                            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                                            <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: '#ff4d4d' }}>
                                                <ListItemIcon><Logout fontSize="small" sx={{ color: '#ff4d4d' }} /></ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        href="/login"
                                        startIcon={<LoginIcon />}
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            fontWeight: 700,
                                            boxShadow: '0 0 15px rgba(115, 253, 170, 0.3)',
                                        }}
                                    >
                                        Login
                                    </Button>
                                )
                            )}
                        </>
                    )}
                    {isMobile && (
                        <IconButton color="inherit" onClick={handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: 'background.default' },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar >
    );
};

export default Navbar;
