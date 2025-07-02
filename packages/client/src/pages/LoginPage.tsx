"use client"

import { useState, useContext } from "react"
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material"
import { SportsEsports, Brightness4, Brightness7 } from "@mui/icons-material"
import LoginIcon from "@mui/icons-material/Login"
import LoginForm from "../components/LoginForm"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import { useThemeContext } from "../contexts/ThemeContext"

export default function LoginPage() {
  const { user, login, isLoading, error } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = (location.state as any)?.from?.pathname || "/"
  const [showPassword, setShowPassword] = useState(false)
  const { toggleTheme, mode } = useThemeContext()
  const theme = useTheme()

  if (user) return <Navigate to={fromPath} replace />

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
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: alpha(theme.palette.background.default, 0.5),
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 2,
        }}
      >
        <SportsEsports sx={{ fontSize: 32, color: "white" }} />
        <Typography variant="h5" fontWeight="bold" color="white">
          Game Center
        </Typography>
      </Box>

      <IconButton
        onClick={toggleTheme}
        sx={{ position: "absolute", top: 20, right: 20, zIndex: 2, color: "white" }}
      >
        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

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
          background: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <LoginIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
        </Box>

        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Oyun Merkezi'ne Giriş Yap
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
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
            onTogglePassword={() => setShowPassword((p) => !p)}
            onSubmit={async (username, password) => {
              try {
                await login(username, password)
                navigate(fromPath, { replace: true })
              } catch {}
            }}
          />
        )}
      </Paper>
    </Box>
  )
}