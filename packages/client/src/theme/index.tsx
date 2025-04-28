import { createTheme, type PaletteMode } from "@mui/material/styles";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#3A59D1",
        light: "#5B7AE3",
        dark: "#2F4BA8",
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
      fontFamily: '"Inter", "Roboto", sans-serif',
    },
    shape: { borderRadius: 8 },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor:
                  mode === "dark"
                    ? "rgba(141,153,174,0.3)"
                    : "rgba(108,117,125,0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3A86FF",
              },
            },
          },
        },
      },
    },
  });