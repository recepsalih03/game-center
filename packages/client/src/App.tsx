import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LoginPage toggleTheme={toggleTheme} isDarkMode={mode === "dark"} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;