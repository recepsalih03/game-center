import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggleTheme = () =>
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LoginPage/>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;