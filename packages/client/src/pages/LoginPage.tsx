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
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname || "/";

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/toy-story-cloud.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

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
          Game Center
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
          Sign in to Game Center
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Access your game library, connect with friends, and discover new games
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
            onSubmit={async (email: string, password: string) => {
              try {
                await login(email, password);
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