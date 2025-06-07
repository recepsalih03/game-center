"use client"

import React from "react"
import { Grid, Card, CardMedia, Box, Typography } from "@mui/material"
import { People, Star } from "@mui/icons-material"
import type { Game } from "../services/gamesService"

interface Props { game: Game }

const GameOverview: React.FC<Props> = ({ game }) => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 5 }}>
      <Card sx={{ borderRadius: 2 }}>
        <CardMedia component="img" height="220" image={game.imageUrl} alt={game.title} />
      </Card>
    </Grid>

    <Grid size={{ xs: 12, md: 7 }}>
      <Typography variant="h6" gutterBottom>
        Oyun Hakkında
      </Typography>

      <Typography paragraph mb={3}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at velit maximus, molestie
        est a, tempor magna. Integer ullamcorper neque eu purus euismod, ac facilisis quam
        faucibus. Suspendisse potenti.
      </Typography>

      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <People color="action" />
          <Typography>{game.players} online</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Star sx={{ color: "#ffb400" }} />
          <Typography>{game.rating}</Typography>
        </Box>
      </Box>
    </Grid>
  </Grid>
)

export default GameOverview