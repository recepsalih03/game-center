"use client"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  useTheme,
  alpha,
  Fade,
} from "@mui/material"
import { Home, EmojiEvents } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

interface Props {
  open: boolean
  winner: string
}

export default function GameOverDialog({ open, winner }: Props) {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate("/")
  }

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          textAlign: "center",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(45deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.1)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          pb: 3,
        }}
      >
        <Fade in={open} timeout={800}>
          <Box>
            <EmojiEvents
              sx={{
                fontSize: 64,
                color: theme.palette.warning.main,
                mb: 2,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              🎉 Oyun Bitti! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tebrikler! Kazanan oyuncu:
            </Typography>
          </Box>
        </Fade>
      </DialogTitle>

      <DialogContent sx={{ py: 4 }}>
        <Fade in={open} timeout={1200}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {winner}
            </Typography>
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "center" }}>
        <Button
          onClick={handleGoToHome}
          variant="contained"
          size="large"
          startIcon={<Home />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: theme.shadows[8],
            },
            transition: "all 0.2s ease",
          }}
        >
          Anasayfaya Dön
        </Button>
      </DialogActions>
    </Dialog>
  )
}
