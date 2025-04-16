import { createTheme, type PaletteMode } from "@mui/material/styles";

const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#3A86FF",
        light: "#61A0FF",
        dark: "#2D6CCC",
      },
      secondary: {
        main: mode === "dark" ? "#8D99AE" : "#6C757D",
        light: mode === "dark" ? "#A5AEC0" : "#ADB5BD",
        dark: mode === "dark" ? "#6B7689" : "#495057",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#F8F9FA",
        paper: mode === "dark" ? "#1E1E1E" : "#FFFFFF",
      },
      text: {
        primary: mode === "dark" ? "#EDF2F4" : "#212529",
        secondary: mode === "dark" ? "#8D99AE" : "#6C757D",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
        letterSpacing: "0.02em",
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
        letterSpacing: "0.02em",
      },
      body1: {
        letterSpacing: "0.01em",
      },
      body2: {
        letterSpacing: "0.01em",
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: mode === "dark" ? "rgba(141, 153, 174, 0.3)" : "rgba(108, 117, 125, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(58, 134, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3A86FF",
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

const theme = getTheme("dark");

export { getTheme };
export default theme;