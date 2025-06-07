import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  onSubmit: (username: string, password: string) => Promise<void>;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const LoginForm: React.FC<Props> = ({
  onSubmit,
  showPassword,
  onTogglePassword,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(username, password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
      <TextField
        fullWidth
        label="Kullanıcı Adı"
        type="text"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoFocus
      />
      <TextField
        fullWidth
        label="Şifre"
        type={showPassword ? "text" : "password"}
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.3 }}>
        Giriş Yap
      </Button>
    </Box>
  );
};

export default LoginForm;