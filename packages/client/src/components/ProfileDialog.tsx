"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
} from "@mui/material"
import { Person, CalendarToday, Close } from "@mui/icons-material"

interface Props {
  open: boolean
  onClose: () => void
  username: string
  memberSince: string
  getInitials: (name: string) => string
}

export default function ProfileDialog({ open, onClose, username, memberSince, getInitials }: Props) {
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Person color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          Kullanıcı Profili
        </Typography>
        <Button onClick={onClose} size="small" sx={{ minWidth: "auto", p: 1 }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Fade in={open} timeout={600}>
          <Box sx={{ p: 3 }}>
            <Card
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    fontSize: "2rem",
                    fontWeight: 700,
                    boxShadow: theme.shadows[8],
                  }}
                >
                  {getInitials(username)}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Oyuncu
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Üyelik Bilgileri
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <CalendarToday color="primary" fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Üyelik Başlangıcı
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {memberSince}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  )
}
