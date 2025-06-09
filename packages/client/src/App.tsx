import React from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { CustomThemeProvider } from "./contexts/ThemeContext";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import GameDetailPage from "./pages/GameDetailPage";
import PrivateRoute from "./auth/PrivateRoute";
import GamePlayPage from "./pages/GamePlayPage";

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <SocketProvider>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/play/:id" element={<GamePlayPage />} />
              <Route path="/game/:id"element={<GameDetailPage />} />
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
        </SocketProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;