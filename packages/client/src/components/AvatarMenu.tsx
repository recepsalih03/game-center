"use client"
import React from "react"
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material"
import { AccountCircle, Logout } from "@mui/icons-material"

interface Props {
  anchorEl: HTMLElement | null
  onClose: () => void
  onProfile: () => void
  onLogout: () => void
}

export default function AvatarMenu({ anchorEl, onClose, onProfile, onLogout }: Props) {
  const open = Boolean(anchorEl)
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={onProfile}>
        <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
        <ListItemText>Profil</ListItemText>
      </MenuItem>
      <MenuItem onClick={onLogout}>
        <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
        <ListItemText>Çıkış Yap</ListItemText>
      </MenuItem>
    </Menu>
  )
}