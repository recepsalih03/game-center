"use client"
import React from "react"
import { Box, TextField, Button, Typography } from "@mui/material"
import { Add } from "@mui/icons-material"
import { GameCardProps } from "./GameCard"

interface Props {
  newLobbyName: string
  setNewLobbyName: (v: string) => void
  selectedGame: string
  setSelectedGame: (v: string) => void
  maxPlayers: number
  setMaxPlayers: (v: number) => void
  games: GameCardProps[]
  onCreate: () => void
}

export default function LobbyForm({
  newLobbyName, setNewLobbyName,
  selectedGame, setSelectedGame,
  maxPlayers, setMaxPlayers,
  games, onCreate,
}: Props) {
  return (
    <Box mb={4}>
      <Typography variant="subtitle1" gutterBottom>Create New Lobby</Typography>
      <TextField fullWidth label="Lobby Name" margin="dense" size="small"
        value={newLobbyName} onChange={(e)=>setNewLobbyName(e.target.value)} />
      <TextField select fullWidth label="Select Game" margin="dense" size="small"
        value={selectedGame} onChange={(e)=>setSelectedGame(e.target.value)}
        SelectProps={{ native: true }}>
        <option value="" />
        {games.map((g)=> <option key={g.title} value={g.title}>{g.title}</option>)}
      </TextField>
      <TextField fullWidth label="Max Players" type="number" margin="dense" size="small"
        InputProps={{ inputProps: { min:2, max:10 } }}
        value={maxPlayers} onChange={(e)=>setMaxPlayers(Number(e.target.value))} />
      <Button variant="contained" color="success" startIcon={<Add />} fullWidth sx={{ mt:1.5 }} onClick={onCreate}>
        Create Lobby
      </Button>
    </Box>
  )
}