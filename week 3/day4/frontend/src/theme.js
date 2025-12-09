// src/theme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: { main: "#6C63FF" },      // violet
    secondary: { main: "#00C49A" },    // teal
    background: { default: "#F6F8FF", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#475569" }
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    subtitle1: { color: "#6B7280" },
    button: { textTransform: "none", fontWeight: 700 }
  },
  components: {
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: "10px 18px" }
      }
    }
  }
});

theme = responsiveFontSizes(theme);
export default theme;
