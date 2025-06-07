import React, { useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { SportsEsports } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, isLoading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname || "/";

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  if (user) {
    return <Navigate to={fromPath} replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/toy-story-cloud.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <SportsEsports sx={{ fontSize: 32, color: "white", mr: 1 }} />
        <Typography variant="h5" fontWeight="bold" color="white">
          Oyun Merkezi
        </Typography>
      </Box>

      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <LoginIcon sx={{ fontSize: 30, color: "#3A59D1" }} />
        </Box>

        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Oyun Merkezi'ne Giriş Yap
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Oyun kütüphanene eriş, arkadaşlarınla bağlantı kur ve yeni oyunlar keşfet.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <CircularProgress />
        ) : (
          <LoginForm
            showPassword={showPassword}
            onTogglePassword={handleClickShowPassword}
            onSubmit={async (username, password) => {
              try {
                await login(username, password);
                navigate(fromPath, { replace: true });
              } catch {
              }
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default LoginPage;