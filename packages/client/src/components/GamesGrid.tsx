"use client"
import React from "react"
import { Grid, Typography } from "@mui/material"
import GameCard from "./GameCard"
import { Game } from "../services/gamesService"

interface Props { games: Game[] }

export default function GamesGrid({ games }: Props) {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Oyunlar
      </Typography>
      <Grid container spacing={2}>
        {games.map((g) => (
          <Grid key={g.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <GameCard {...g} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}