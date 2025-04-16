import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../contexts/AuthContext";
import { users, User } from "../config/users";
import { hashData } from "../utils/hash";

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredHash = hashData(password);
    const foundUser: User | undefined = users.find(
      (user) => user.email === email && user.passwordHash === enteredHash
    );
    if (foundUser) {
      login(foundUser);
      setError("");
    } else {
      setError("Girdiğiniz bilgiler yanlış. Lütfen tekrar deneyin.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        fullWidth
        label="Email"
        type="email"
        placeholder="Enter your email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            color="primary"
          />
        }
        label="Beni Hatırla"
        sx={{ mb: 3 }}
      />
      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        sx={{
          py: 1.5,
          borderRadius: 2,
          transition: "all 0.2s ease",
          "&:hover": { transform: "translateY(-2px)" },
        }}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default LoginForm;