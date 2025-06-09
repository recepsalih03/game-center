import React from "react";
import {
  AppBar, Toolbar, IconButton, Avatar, Badge, Typography, Box, Link,
} from "@mui/material";
import { SportsEsports, Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "../contexts/ThemeContext";
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  username: string;
  notifCount: number;
  onAvatarClick: (e: React.MouseEvent<HTMLElement>) => void;
  getInitials: (name: string) => string;
}

export default function HeaderBar({ username, notifCount, onAvatarClick, getInitials }: Props) {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <SportsEsports sx={{ mr: 1 }} color="primary" />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Game Center
          </Typography>
        </Link>
        
        <Box sx={{ flexGrow: 1 }} />

        <Box>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <IconButton onClick={onAvatarClick} size="small" sx={{ ml: 1 }}>
          <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold", width: 32, height: 32 }}>
            {getInitials(username)}
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}