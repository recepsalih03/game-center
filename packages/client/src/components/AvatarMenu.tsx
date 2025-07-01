"use client"

import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, Box, Typography, useTheme, alpha } from "@mui/material"
import { Logout, Person } from "@mui/icons-material"

interface Props {
  anchorEl: HTMLElement | null
  onClose: () => void
  onProfile: () => void
  onLogout: () => void
}

export default function AvatarMenu({ anchorEl, onClose, onProfile, onLogout }: Props) {
  const theme = useTheme()
  const open = Boolean(anchorEl)

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        elevation: 8,
        sx: {
          p: 1,
          borderRadius: 2,
          minWidth: 200,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          "& .MuiMenuItem-root": {
            borderRadius: 1,
            my: 0.5,
            padding: theme.spacing(1, 2),
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              transform: "translateX(4px)",
            },
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1, mb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Hesap Menüsü
        </Typography>
      </Box>

      <Divider sx={{ mb: 0.5 }} />

      <MenuItem
        onClick={() => {
          onProfile()
          onClose()
        }}
      >
        <ListItemIcon>
          <Person fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Profil" primaryTypographyProps={{ fontWeight: 500 }} />
      </MenuItem>

      <MenuItem
        onClick={() => {
          onLogout()
          onClose()
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Çıkış Yap" primaryTypographyProps={{ fontWeight: 500, color: "error.main" }} />
      </MenuItem>
    </Menu>
  )
}