import React from "react";
import { Grid, Card, CardMedia, Box, Typography } from "@mui/material";
import type { Game } from "../services/gamesService";

interface Props { game: Game }

export default function GameOverview({ game }: Props) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardMedia component="img" height="220" image={game.imageUrl} alt={game.title} />
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {game.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {game.category}
        </Typography>
        <Typography paragraph mb={3}>
          {game.description}
        </Typography>
      </Grid>
    </Grid>
  );
}