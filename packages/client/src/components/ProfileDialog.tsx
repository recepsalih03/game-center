"use client"
import React from "react"
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Typography, Button, Divider, Box,
} from "@mui/material"

interface Props {
  open: boolean
  onClose: () => void
  username: string
  memberSince: string
  getInitials: (name: string) => string
}

export default function ProfileDialog({ open, onClose, username,  memberSince, getInitials }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Kullanıcı Profili</DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" mb={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64, mx: "auto", mb: 1 }}>
            {getInitials(username)}
          </Avatar>
          <Typography variant="h6">{username}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>Üyelik Bilgileri</Typography>
        <Typography variant="body2">Üyelik Başlangıcı: {memberSince}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  )
}