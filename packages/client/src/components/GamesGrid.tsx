"use client"
import React from "react"
import { Grid, Typography } from "@mui/material"
import GameCard, { GameCardProps } from "./GameCard"

interface Props { games: GameCardProps[] }

export default function GamesGrid({ games }: Props) {
  return (
    <>
      <Typography variant="h4" gutterBottom>Games</Typography>
      <Grid container spacing={2}>
        {games.map((g, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <GameCard {...g} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}