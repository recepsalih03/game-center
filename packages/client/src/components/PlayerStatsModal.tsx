"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  useTheme,
  alpha,
} from "@mui/material"
import { Close, EmojiEvents, Timer, TrendingUp, Person } from "@mui/icons-material"
import { tombalaPlayerStats } from "../data/dummyStats"

interface PlayerStatsModalProps {
  open: boolean
  onClose: () => void
}

export default function PlayerStatsModal({ open, onClose }: PlayerStatsModalProps) {
  const theme = useTheme()

  const sortedPlayers = [...tombalaPlayerStats].sort((a, b) => b.winRate - a.winRate)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmojiEvents color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Tombala Oyuncu İstatistikleri
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(theme.palette.background.default, 0.3)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person fontSize="small" />
                    Oyuncu
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <TrendingUp fontSize="small" />
                    Oynanan
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <EmojiEvents fontSize="small" />
                    Kazanılan
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Kazanma Oranı
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <Timer fontSize="small" />
                    En Hızlı
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Ort. Sıralama
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Toplam Puan
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPlayers.map((player, index) => (
                <TableRow
                  key={player.username}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {index === 0 && (
                        <Chip
                          label="1"
                          size="small"
                          color="primary"
                          sx={{ minWidth: 24, height: 20, fontSize: "0.75rem" }}
                        />
                      )}
                      {index === 1 && (
                        <Chip
                          label="2"
                          size="small"
                          color="secondary"
                          sx={{ minWidth: 24, height: 20, fontSize: "0.75rem" }}
                        />
                      )}
                      {index === 2 && (
                        <Chip
                          label="3"
                          size="small"
                          color="warning"
                          sx={{ minWidth: 24, height: 20, fontSize: "0.75rem" }}
                        />
                      )}
                      <Typography fontWeight={500}>{player.username}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={500}>
                      {player.gamesPlayed}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={500} color="success.main">
                      {player.gamesWon}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${player.winRate}%`}
                      size="small"
                      color={player.winRate > 27 ? "success" : player.winRate > 25 ? "warning" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={500}>
                      {player.fastestWin}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={500}>
                      {player.averagePosition}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {player.totalScore.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: alpha(theme.palette.info.main, 0.1) }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            İstatistikler son 30 günlük oyun verilerine dayanmaktadır
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
