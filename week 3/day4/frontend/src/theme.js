// theme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 700 },
  },

  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 18px",
        },
      },
    },
  },
}; 

const lightPalette = {
  mode: "light",
  primary: { main: "#2D6DF6" },
  secondary: { main: "#4CC9F0" },
  background: {
    default: "#F5F7FA",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1A1A1A",
    secondary: "#6B7280",
  },
};


const darkPalette = {
  mode: "dark",
  primary: { main: "#2D6DF6"},
  secondary: { main: "#4CC9F0" },
  background: {
    default: "#0F0F0F",
    paper: "#121212",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#CCCCCC",
  },
};

export const getTheme = (mode = "light") => {
  const palette = mode === "light" ? lightPalette : darkPalette;

  let theme = createTheme({
    palette,
    ...baseTheme,
    components: {
      ...baseTheme.components,
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#121212",
            color: mode === "light" ? "#1A1A1A" : "#FFFFFF",
            boxShadow:
              mode === "light"
                ? "0 2px 10px rgba(0,0,0,0.05)"
                : "0 2px 10px rgba(0,0,0,0.6)",
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};
