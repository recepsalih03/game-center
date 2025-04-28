import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  SportsEsports,
  Lock,
} from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        overflow: "hidden",
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

        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          gutterBottom
        >
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

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ alignSelf: "flex-end", mt: 1, mb: 3 }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Forgot password?
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            borderRadius: 2,
            py: 1.5,
            backgroundColor: "3A59D17",
            "&:hover": { backgroundColor: "#2F4BA8" },
          }}
        >
          Get Started
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;