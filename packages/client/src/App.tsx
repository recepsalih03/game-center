import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getTheme } from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./auth/PrivateRoute";
import GameDetailPage from "./pages/GameDetailPage";
import GamePlayPage from "./pages/GamePlayPage";

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/game/:id"  element={<GameDetailPage />} />
            <Route path="/play/:id"  element={<GamePlayPage />} />  
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;