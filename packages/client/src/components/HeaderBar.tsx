"use client"
import React from "react"
import {
  AppBar, Toolbar, IconButton, Avatar, Badge, Typography,
} from "@mui/material"
import { Notifications, SportsEsports } from "@mui/icons-material"

interface Props {
  username: string
  notifCount: number
  onAvatarClick: (e: React.MouseEvent<HTMLElement>) => void
  getInitials: (name: string) => string
}

export default function HeaderBar({ username, notifCount, onAvatarClick, getInitials }: Props) {
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <SportsEsports sx={{ mr: 1 }} color="primary" />
        <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
          GameHub
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={notifCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <IconButton onClick={onAvatarClick} size="large" sx={{ ml: 1 }}>
          <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
            {getInitials(username)}
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}