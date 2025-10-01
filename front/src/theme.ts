// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#22c55e",  // verde principal
      dark: "#16a34a",  // hover / ativo
      light: "#86efac", // versão clara
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#1f2937",
      light: "#6b7280",
      contrastText: "#ffffff"
    },
    error: { main: "#ef4444" },
    success: { main: "#16a34a" },
    background: { default: "#f0f9f0", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#6b7280", disabled: "#9ca3af" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(34,197,94,0.25)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export default theme;
