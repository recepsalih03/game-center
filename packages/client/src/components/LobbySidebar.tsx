"use client"
import React from "react"
import { Paper, Typography } from "@mui/material"
import LobbyForm from "./LobbyForm"
import LobbyList, { LobbyItem } from "./LobbyList"
import { GameCardProps } from "./GameCard"

interface Props {
  games: GameCardProps[]
  lobbies: LobbyItem[]
  formState: {
    newLobbyName: string
    setNewLobbyName: (v: string)=>void
    selectedGame: string
    setSelectedGame: (v: string)=>void
    maxPlayers: number
    setMaxPlayers: (v: number)=>void
    onCreate: () => void
  }
}

export default function LobbySidebar({ games, lobbies, formState }: Props) {
  return (
    <Paper elevation={2} sx={{ p:3 }}>
      <Typography variant="h5" gutterBottom>Game Lobbies</Typography>
      <LobbyForm games={games} {...formState} />
      <Typography variant="subtitle1" gutterBottom>Available Lobbies</Typography>
      <LobbyList lobbies={lobbies} />
    </Paper>
  )
}