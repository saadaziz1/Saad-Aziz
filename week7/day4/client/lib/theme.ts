"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#000000",
        },
        secondary: {
            main: "#ffffff",
        },
        background: {
            default: "#ffffff",
            paper: "#f5f5f5",
        },
        text: {
            primary: "#000000",
            secondary: "#757575",
        },
    },
    typography: {
        fontFamily: "var(--font-geist-sans), Inter, sans-serif",
        h1: {
            fontWeight: 900,
            fontSize: "4.5rem",
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            fontStyle: "italic",
            lineHeight: 0.9,
        },
        h2: {
            fontWeight: 800,
            fontSize: "2.5rem",
            textTransform: "uppercase",
            fontStyle: "italic",
            lineHeight: 1,
        },
        h3: {
            fontWeight: 800,
            fontSize: "1.75rem",
            textTransform: "uppercase",
            fontStyle: "italic",
        },
        h6: {
            fontWeight: 700,
            fontSize: "1.2rem",
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
        },
        body2: {
            fontSize: "0.85rem",
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.9rem",
        },
    },
    shape: {
        borderRadius: 0,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 30,
                    padding: "10px 24px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
                contained: {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#333333",
                    },
                },
                outlined: {
                    borderColor: "#000000",
                    color: "#000000",
                    "&:hover": {
                        backgroundColor: "#f5f5f5",
                        borderColor: "#000000",
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "#000000",
                },
            },
        },
    },
});

export default theme;
