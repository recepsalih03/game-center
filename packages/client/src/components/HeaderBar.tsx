"use client"

import React from "react"
import { AppBar, Toolbar, IconButton, Avatar, Typography, Box, Link, useTheme, alpha, Fade } from "@mui/material"
import { SportsEsports, Brightness4, Brightness7 } from "@mui/icons-material"
import { useThemeContext } from "../contexts/ThemeContext"
import { Link as RouterLink } from "react-router-dom"

interface Props {
  username: string
  notifCount: number
  onAvatarClick: (e: React.MouseEvent<HTMLElement>) => void
  getInitials: (name: string) => string
}

export default function HeaderBar({ username, notifCount, onAvatarClick, getInitials }: Props) {
  const theme = useTheme()
  const { mode, toggleTheme } = useThemeContext()

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: theme.palette.text.primary
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Fade in timeout={800}>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.02)" }
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                boxShadow: theme.shadows[4]
              }}
            >
              <SportsEsports sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Game Center
            </Typography>
          </Link>
        </Fade>

        <Box sx={{ flexGrow: 1 }} />

        <Fade in timeout={1000}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  transform: "scale(1.1)"
                },
                transition: "all 0.2s ease"
              }}
            >
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton
              onClick={onAvatarClick}
              sx={{
                p: 0.5,
                "&:hover": { transform: "scale(1.1)" },
                transition: "all 0.2s ease"
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 700,
                  width: 40,
                  height: 40,
                  boxShadow: theme.shadows[4]
                }}
              >
                {getInitials(username)}
              </Avatar>
            </IconButton>
          </Box>
        </Fade>
      </Toolbar>
    </AppBar>
  )
}