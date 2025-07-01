"use client"

import { useState } from "react"
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material"
import { PlayArrow, MenuBook } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import PlayerStatsModal from "./PlayerStatsModal"

export interface GameCardProps {
  id: number
  title: string
  imageUrl: string
}

export default function GameCard({ id, title, imageUrl }: GameCardProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [statsOpen, setStatsOpen] = useState(false)

  const isTombalaGame = title?.toLowerCase().includes("tombala")

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.7)} 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: "all 0.3s ease",
          position: "relative",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: theme.shadows[12],
            "& .game-image": {
              transform: "scale(1.05)",
            },
            "& .play-button": {
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            },
            "& .stats-button": {
              opacity: 1,
              transform: "scale(1)",
            },
          },
        }}
      >
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="180"
            image={imageUrl}
            alt={title}
            className="game-image"
            sx={{
              transition: "transform 0.3s ease",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(180deg, transparent 0%, ${alpha(theme.palette.common.black, 0.3)} 100%)`,
            }}
          />

          {isTombalaGame && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <Tooltip title="Oyuncu İstatistikleri">
                <IconButton
                  className="stats-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setStatsOpen(true)
                  }}
                  sx={{
                    background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.dark, 0.8)} 100%)`,
                    color: "white",
                    boxShadow: theme.shadows[4],
                    opacity: 0.8,
                    transform: "scale(0.9)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.dark, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
                      transform: "scale(1.1)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <MenuBook fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            align="center"
            noWrap
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            {title}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<PlayArrow />}
            className="play-button"
            onClick={() => navigate(`/game/${id}`)}
            sx={{
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.8)})`,
              transition: "all 0.3s ease",
            }}
          >
            Oyna
          </Button>
        </CardContent>
      </Card>

      {isTombalaGame && <PlayerStatsModal open={statsOpen} onClose={() => setStatsOpen(false)} />}
    </>
  )
}
