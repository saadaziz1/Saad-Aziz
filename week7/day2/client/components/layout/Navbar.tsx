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
import { useRouter, usePathname } from 'next/navigation';
import { useGetProfileQuery, apiSlice } from '@/store/apiSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { Skeleton } from '@mui/material';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { data: user, isLoading } = useGetProfileQuery();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const navItems = [
        { label: 'How it Works', path: '/work' },
        { label: 'Blog', path: '/blog' },
        { label: 'Support', path: '/support' },
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
        toast.success('Logout successful');
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Button
                                        key={item.label}
                                        component={Link}
                                        href={item.path}
                                        sx={{
                                            color: isActive ? "primary.main" : "text.primary",
                                            fontWeight: 500,
                                            fontSize: '18px',
                                            textTransform: "none",
                                            borderRadius: 0,
                                            borderBottom: isActive ? "2px solid" : "2px solid transparent",
                                            borderColor: isActive ? "primary.main" : "transparent",
                                            pb: 0.5,
                                            "&:hover": {
                                                color: "primary.main",
                                                borderColor: "primary.main"
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </Box>
                    )}
                </Box>

                <Box sx={{
                    mr: 2,
                    display: 'flex',
                    gap: 1,

                    '& .MuiIconButton-root': {
                        backgroundColor: 'transparent',
                        transition: 'color 0.3s ease',

                        '&:hover': {
                            backgroundColor: 'transparent',   // remove grey circle
                            color: '#73FDAA',                  // change SVG color
                        },
                    },

                    '& svg': {
                        color: 'white',
                        transition: 'color 0.3s ease',
                    },

                    '& .MuiIconButton-root:hover svg': {
                        color: '#73FDAA',   // makes stroke + fill change
                    },
                }}>
                    {!isMobile && (
                        <>
                            <Box sx={{ mr: 2 }}>
                                <IconButton color="inherit">
                                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.5204 13.1803V15.7966H14.6052V18.9943H16.5204V28.5H20.4572V18.9943H23.0982C23.0982 18.9943 23.3471 17.461 23.4668 15.7833H20.4724V13.5983C20.4724 13.2696 20.9018 12.8307 21.3274 12.8307H23.4706V9.5H20.5541C16.4235 9.5 16.5204 12.7015 16.5204 13.1803Z" fill="currentColor" />
                                        <path d="M7.6 3.8C6.59218 3.8 5.62563 4.20036 4.91299 4.91299C4.20036 5.62563 3.8 6.59218 3.8 7.6V30.4C3.8 31.4078 4.20036 32.3744 4.91299 33.087C5.62563 33.7996 6.59218 34.2 7.6 34.2H30.4C31.4078 34.2 32.3744 33.7996 33.087 33.087C33.7996 32.3744 34.2 31.4078 34.2 30.4V7.6C34.2 6.59218 33.7996 5.62563 33.087 4.91299C32.3744 4.20036 31.4078 3.8 30.4 3.8H7.6ZM7.6 0H30.4C32.4156 0 34.3487 0.800712 35.774 2.22599C37.1993 3.65126 38 5.58435 38 7.6V30.4C38 32.4156 37.1993 34.3487 35.774 35.774C34.3487 37.1993 32.4156 38 30.4 38H7.6C5.58435 38 3.65126 37.1993 2.22599 35.774C0.800712 34.3487 0 32.4156 0 30.4V7.6C0 5.58435 0.800712 3.65126 2.22599 2.22599C3.65126 0.800712 5.58435 0 7.6 0V0Z" fill="currentColor" />
                                    </svg>

                                </IconButton>
                                <IconButton color="inherit">
                                    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.6667 32.4583H8.54175V15.375H13.6667V32.4583ZM32.4584 32.4583H27.3334V23.3324C27.3334 20.9544 26.4861 19.7705 24.8068 19.7705C23.476 19.7705 22.6321 20.4334 22.2084 21.7608V32.4583H17.0834C17.0834 32.4583 17.1517 17.0833 17.0834 15.375H21.1287L21.4414 18.7917H21.5473C22.5979 17.0833 24.2772 15.9251 26.58 15.9251C28.3311 15.9251 29.7473 16.412 30.8287 17.6351C31.9169 18.86 32.4584 20.5034 32.4584 22.8114V32.4583Z" fill="currentColor" />
                                        <path d="M11.1042 13.6667C12.5666 13.6667 13.7521 12.5194 13.7521 11.1042C13.7521 9.68893 12.5666 8.54166 11.1042 8.54166C9.64181 8.54166 8.4563 9.68893 8.4563 11.1042C8.4563 12.5194 9.64181 13.6667 11.1042 13.6667Z" fill="currentColor" />
                                        <rect x="3.5" y="3.5" width="35" height="35" rx="3.5" stroke="currentColor" strokeWidth="3" />
                                    </svg>

                                </IconButton>
                                <IconButton color="inherit">
                                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M14.135 9.2868C14.0593 9.27488 13.9825 9.27306 13.9064 9.2814C12.3926 9.4452 10.0886 10.2624 8.72776 11.0004C8.63788 11.0494 8.55743 11.114 8.49016 11.1912C7.92496 11.8374 7.41196 12.8904 7.01056 13.8876C6.59656 14.91 6.25456 15.99 6.06196 16.7712C5.42476 19.3092 5.07736 22.3566 5.03056 25.2474C5.02907 25.3916 5.06373 25.534 5.13136 25.6614C5.67136 26.6928 6.83596 27.6486 8.00236 28.347C9.18136 29.0544 10.5584 29.6124 11.6672 29.7204C11.8 29.7331 11.934 29.7148 12.0586 29.667C12.1832 29.6192 12.2951 29.5433 12.3854 29.445C12.6626 29.1444 13.1342 28.4424 13.4906 27.897C13.6526 27.6486 13.8056 27.411 13.9244 27.222C15.116 27.438 16.61 27.564 18.5 27.564C20.3864 27.564 21.8804 27.438 23.072 27.222C23.1908 27.4128 23.342 27.6486 23.504 27.8952C23.8604 28.4424 24.332 29.1444 24.611 29.445C24.7013 29.5433 24.8131 29.6192 24.9377 29.667C25.0623 29.7148 25.1963 29.7331 25.3292 29.7204C26.438 29.6124 27.8132 29.0544 28.9922 28.347C30.1586 27.6486 31.3232 26.6928 31.865 25.6614C31.932 25.5338 31.966 25.3915 31.964 25.2474C31.919 22.3566 31.5698 19.3074 30.9362 16.7694C30.6816 15.7892 30.3635 14.8265 29.984 13.8876C29.5826 12.8904 29.0696 11.8356 28.5062 11.1912C28.4384 11.1139 28.3573 11.0492 28.2668 11.0004C26.9078 10.2624 24.6038 9.4452 23.0882 9.2814C23.0127 9.27322 22.9364 9.27504 22.8614 9.2868C22.5221 9.35208 22.2039 9.49913 21.9344 9.7152C21.3306 10.2013 20.8424 10.8155 20.5052 11.5134C19.8381 11.4611 19.1691 11.4353 18.5 11.436C17.7764 11.436 17.1068 11.463 16.4894 11.5116C16.1519 10.8143 15.6637 10.2007 15.0602 9.7152C14.7911 9.4994 14.4736 9.35236 14.135 9.2868ZM24.8324 26.7684C25.0857 27.1585 25.3455 27.5444 25.6118 27.9258C26.3246 27.7638 27.2336 27.3858 28.1048 26.8638C29.0822 26.2788 29.858 25.6038 30.2324 25.0332C30.173 22.3224 29.8382 19.5072 29.2604 17.1888C29.025 16.2858 28.7316 15.399 28.382 14.5338C28.022 13.6374 27.635 12.8778 27.2984 12.4422C26.1284 11.8356 24.2834 11.1948 23.081 11.0202C23.0448 11.0421 23.0099 11.0662 22.9766 11.0922C22.8274 11.2095 22.6911 11.3423 22.5698 11.4882C22.4988 11.5727 22.431 11.6598 22.3664 11.7492C22.9154 11.85 23.405 11.9706 23.8388 12.1038C25.07 12.4818 25.9574 13.0038 26.3912 13.5816C26.5287 13.7649 26.5877 13.9953 26.5553 14.2222C26.5229 14.449 26.4017 14.6537 26.2184 14.7912C26.1276 14.8593 26.0243 14.9088 25.9144 14.937C25.8045 14.9651 25.6901 14.9714 25.5778 14.9553C25.3509 14.9229 25.1462 14.8017 25.0088 14.6184C24.9026 14.478 24.44 14.0964 23.3312 13.7544C22.2602 13.4268 20.6852 13.164 18.5 13.164C16.3148 13.164 14.738 13.4268 13.6688 13.7562C12.56 14.0982 12.0974 14.4762 11.9912 14.6184C11.9231 14.7092 11.8378 14.7856 11.7402 14.8434C11.6425 14.9013 11.5345 14.9393 11.4222 14.9553C11.1953 14.9877 10.9649 14.9287 10.7816 14.7912C10.6908 14.7231 10.6143 14.6378 10.5565 14.5402C10.4987 14.4426 10.4607 14.3345 10.4446 14.2222C10.4122 13.9953 10.4713 13.7649 10.6088 13.5816C11.0426 13.002 11.93 12.4836 13.1612 12.1056C13.5932 11.9706 14.0828 11.8518 14.63 11.751C14.5653 11.6606 14.4968 11.5729 14.4248 11.4882C14.304 11.3424 14.1683 11.2096 14.0198 11.0922C13.9858 11.0661 13.9503 11.0421 13.9136 11.0202C12.713 11.1948 10.868 11.8356 9.69796 12.4422C9.35956 12.8796 8.97436 13.6374 8.61256 14.5338C8.22916 15.4878 7.91056 16.4904 7.73596 17.1888C7.15636 19.5072 6.82156 22.3224 6.76396 25.0332C7.13836 25.6056 7.91236 26.2788 8.88976 26.8656C9.76276 27.3876 10.67 27.7656 11.3846 27.9258C11.6535 27.5462 11.9134 27.1603 12.164 26.7684C10.751 26.2662 9.99316 25.5768 9.49996 24.8388C9.43709 24.7442 9.39345 24.6382 9.37154 24.5268C9.34963 24.4154 9.34989 24.3008 9.37228 24.1894C9.39468 24.0781 9.43879 23.9723 9.50208 23.878C9.56537 23.7838 9.64661 23.7029 9.74116 23.64C9.83571 23.5771 9.94173 23.5335 10.0531 23.5116C10.1646 23.4897 10.2792 23.4899 10.3905 23.5123C10.5018 23.5347 10.6077 23.5788 10.7019 23.6421C10.7962 23.7054 10.8771 23.7866 10.94 23.8812C11.408 24.5868 12.6392 25.836 18.5 25.836C24.3626 25.836 25.592 24.5868 26.06 23.8812C26.1869 23.6902 26.3846 23.5576 26.6094 23.5123C26.8342 23.4671 27.0678 23.513 27.2588 23.64C27.4497 23.767 27.5824 23.9646 27.6276 24.1894C27.6729 24.4143 27.6269 24.6478 27.5 24.8388C27.0068 25.5768 26.2472 26.268 24.8324 26.7684ZM12.344 18.6216C12.7832 18.15 13.379 17.8836 14 17.88C14.621 17.8836 15.2168 18.15 15.656 18.6216C16.0934 19.095 16.34 19.734 16.34 20.4C16.34 21.066 16.0934 21.705 15.656 22.1784C15.2168 22.65 14.621 22.9164 14 22.92C13.6878 22.9167 13.3797 22.8492 13.0948 22.7216C12.8099 22.594 12.5543 22.4091 12.344 22.1784C11.9005 21.6927 11.6562 21.0577 11.66 20.4C11.66 19.734 11.9066 19.095 12.344 18.6216ZM23 17.88C22.379 17.8836 21.7832 18.15 21.344 18.6216C20.9066 19.095 20.66 19.734 20.66 20.4C20.66 21.066 20.9066 21.705 21.344 22.1784C21.7832 22.65 22.379 22.9164 23 22.92C23.621 22.9164 24.2168 22.65 24.656 22.1784C25.0934 21.705 25.34 21.066 25.34 20.4C25.34 19.734 25.0934 19.095 24.656 18.6216C24.4456 18.3909 24.1901 18.206 23.9052 18.0784C23.6202 17.9508 23.3121 17.8833 23 17.88Z" fill="currentColor" />
                                        <rect x="1.5" y="1.5" width="35" height="35" rx="3.5" stroke="currentColor" strokeWidth="3" />
                                    </svg>

                                </IconButton>
                                <IconButton color="inherit">
                                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1_498)">
                                            <path opacity="0.2" d="M13.3207 20.0836L30 8.09112C29.8818 8.03554 29.7533 8.00469 29.6226 8.00049C29.4919 7.9963 29.3618 8.01884 29.2402 8.06672L6.6171 16.9116C5.71022 17.2654 5.83277 18.583 6.78867 18.7782L13.3207 20.0836ZM18.8233 24.9025L14.9996 28.7088C14.8632 28.8467 14.6887 28.9411 14.4983 28.9801C14.3079 29.019 14.1101 29.0007 13.9301 28.9274C13.7502 28.8542 13.5962 28.7294 13.4876 28.5688C13.3791 28.4082 13.321 28.2192 13.3207 28.0256V20.0836L18.8233 24.9025Z" fill="currentColor" />
                                            <path d="M30.3636 7.44761C30.1074 7.22705 29.7971 7.08114 29.4659 7.02538C29.1346 6.96963 28.7946 7.00612 28.4821 7.13097L7.17444 15.6334C6.8007 15.7781 6.48414 16.0436 6.27348 16.389C6.06283 16.7344 5.96977 17.1406 6.00863 17.545C6.0433 17.9493 6.20603 18.3312 6.47241 18.6336C6.73878 18.9359 7.09446 19.1424 7.48609 19.222L12.8996 20.3127V27.185C12.8994 27.5568 13.0079 27.9203 13.2113 28.2293C13.4148 28.5383 13.704 28.779 14.0423 28.9207C14.2662 29.0123 14.5051 29.06 14.7464 29.0614C14.989 29.0623 15.2293 29.014 15.4532 28.9194C15.6772 28.8247 15.8803 28.6856 16.0507 28.5103L19.0518 25.4728L23.588 29.5305C23.9229 29.8306 24.3535 29.9973 24.8 29.9996C24.9964 30.0038 25.1919 29.972 25.3772 29.9058C25.6817 29.8079 25.9559 29.6309 26.1725 29.3923C26.3891 29.1537 26.5407 28.8618 26.6122 28.5454L30.9522 9.28883C31.0281 8.95655 31.0134 8.60955 30.9097 8.28513C30.8059 7.96072 30.6171 7.67117 30.3636 7.44761ZM13.6037 18.5419L7.85545 17.3808L23.969 10.9424L13.6037 18.5419ZM14.7464 27.185V21.6262L17.6551 24.2297L14.7464 27.185ZM24.8116 28.1232L15.3004 19.6208L29.0015 9.57029L24.8116 28.1232Z" fill="currentColor" />
                                            <rect x="1.5" y="1.5" width="35" height="35" rx="3.5" stroke="currentColor" strokeWidth="3" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1_498">
                                                <rect width="38" height="38" fill="currentColor" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </IconButton>
                            </Box>

                            {isLoading ? (
                                <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                            ) : (
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
