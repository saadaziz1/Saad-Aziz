'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#73FDAA', // The specified green
            light: '#73FDAAE3', // With alpha
            contrastText: '#000000',
        },
        white: {
            main: "#FFFFFF",
            contrastText: "#000000",
        },
        background: {
            default: '#010010', // Darker, matching the figma
            paper: '#0A1120',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#94A3B8',
        },
    },
    typography: {
        fontFamily: '"Montserrat", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3.5rem',
            lineHeight: 1.1,
            '@media (max-width:600px)': {
                fontSize: '2.5rem',
            },
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            '@media (max-width:600px)': {
                fontSize: '1.8rem',
            },
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 30,
                    padding: '12px 32px',
                    fontSize: '1rem',
                },

                containedPrimary: {
                    background: '#BBFFFF',
                    color: '#000000',
                    '&:hover': {
                        background: '#5EE095',
                    },
                },


                containedSecondary: {        // use this for white buttons
                    background: '#FFFFFF',
                    color: '#000',
                    '&:hover': {
                        background: '#F3F4F6',
                    },
                },


                outlinedSecondary: {
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    '&:hover': {
                        borderColor: '#73FDAA',
                        color: '#73FDAA',
                    },
                },
            },
        },

        MuiContainer: {
            defaultProps: {
                maxWidth: 'lg',
            },
        },
    },
});

export default theme;

declare module "@mui/material/styles" {
    interface Palette {
        white: Palette["primary"];
    }
    interface PaletteOptions {
        white?: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        white: true;
    }
}
