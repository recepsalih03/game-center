"use client";

import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Avatar,
  Badge, Menu, MenuItem, Box
} from "@mui/material";
import { Notifications, SportsEsports } from "@mui/icons-material";

type Props = { username: string; onLogout: () => void };

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

export default function Header({ username, onLogout }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <SportsEsports color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
          Game Center
        </Typography>

        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Badge badgeContent={4} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
            {getInitials(username)}
          </Avatar>
        </IconButton>

        <Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { setAnchorEl(null); }}>
            Profilim
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onLogout();
            }}
          >
            Çıkış Yap
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}