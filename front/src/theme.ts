import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#22c55e",  
      dark: "#16a34a",  
      light: "#86efac", 
      contrastText: "#ffffff" 
    },
    secondary: {
      main: "#1f2937",  
      light: "#6b7280",
      contrastText: "#ffffff" 
    },
    error: { main: "#ef4444" },   
    success: { main: "#16a34a" },
    background: { default: "#f0f9f0", paper: "#ffffff" }, // fundos
    text: { primary: "#1f2937", secondary: "#6b7280", disabled: "#9ca3af" }, // cores de texto
  },
  shape: { borderRadius: 12 }, // borda padrão dos componentes
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "sans-serif",
    ].join(","), // fonte global
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // borda do botão
          textTransform: "none", // remove uppercase padrão
          fontWeight: 600, // peso da fonte
          padding: "10px 20px", // espaçamento interno
          boxShadow: "none", // sombra inicial
          "&:hover": {
            boxShadow: "0 6px 16px rgba(34,197,94,0.25)", 
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20, // borda dos cards/papers
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)", // sombra padrão
        },
      },
    },
  },
});

export default theme;
