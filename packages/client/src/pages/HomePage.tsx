"use client"

import React, { useState } from "react"
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material"

import HeaderBar      from "../components/HeaderBar"
import AvatarMenu     from "../components/AvatarMenu"
import ProfileDialog  from "../components/ProfileDialog"
import GamesGrid      from "../components/GamesGrid"
import LobbySidebar   from "../components/LobbySidebar"

import type { GameCardProps } from "../components/GameCard"
import type { LobbyItem }     from "../components/LobbyList"

const dummyGames: GameCardProps[] = [
  { id: 1, title: "Epic Adventure", imageUrl: "/placeholder.svg?h=150&w=280", players: 1243, category: "RPG", rating: 4.8 },
  { id: 2, title: "Space Explorers", imageUrl: "/placeholder.svg?h=150&w=280", players: 876,  category: "Strategy", rating: 4.5 },
  { id: 3, title: "Racing Champions", imageUrl: "/placeholder.svg?h=150&w=280", players: 2341, category: "Racing",  rating: 4.2 },
  { id: 4, title: "Battle Royale",   imageUrl: "/placeholder.svg?h=150&w=280", players: 5432, category: "Action",  rating: 4.7 },
  { id: 5, title: "Puzzle Master",   imageUrl: "/placeholder.svg?h=150&w=280", players: 654,  category: "Puzzle",  rating: 4.3 },
  { id: 6, title: "Fantasy World",   imageUrl: "/placeholder.svg?h=150&w=280", players: 1876, category: "MMORPG",  rating: 4.6 },
]

const dummyLobbies: LobbyItem[] = [
  { id: 1, name: "Pro Players Only", players: 3, maxPlayers: 4, game: "Epic Adventure",   status: "open" },
  { id: 2, name: "Casual Fun",       players: 2, maxPlayers: 6, game: "Space Explorers",  status: "open" },
  { id: 3, name: "Tournament Practice", players: 8, maxPlayers: 8, game: "Battle Royale", status: "full" },
  { id: 4, name: "Beginners Welcome",   players: 3, maxPlayers: 5, game: "Racing Champs", status: "open" },
]

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: "#1976d2" },
    secondary: { main: "#ff9100" },
    background: { default: "#fafafa", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
  },
})

const getUserInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase()

export default function HomePage() {
  const [username]      = useState("John Doe")
  const [email]         = useState("john.doe@example.com")
  const [memberSince]   = useState("Jan 2024")

  const [menuAnchor,   setMenuAnchor]   = useState<HTMLElement | null>(null)
  const [profileOpen,  setProfileOpen]  = useState(false)

  const [newLobbyName, setNewLobbyName] = useState("")
  const [selectedGame, setSelectedGame] = useState("")
  const [maxPlayers,   setMaxPlayers]   = useState(4)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const handleCreateLobby = () => {
    console.log({ newLobbyName, selectedGame, maxPlayers })
    setNewLobbyName("")
    setSelectedGame("")
    setMaxPlayers(4)
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      <HeaderBar
        username={username}
        notifCount={4}
        onAvatarClick={(e) => setMenuAnchor(e.currentTarget)}
        getInitials={getUserInitials}
      />

      <AvatarMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onProfile={() => { setMenuAnchor(null); setProfileOpen(true) }}
        onLogout={() => { setMenuAnchor(null); handleLogout() }}
      />

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        username={username}
        email={email}
        memberSince={memberSince}
        getInitials={getUserInitials}
      />

      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Box display="flex" gap={3} flexWrap={{ xs: "wrap", md: "nowrap" }}>
            <Box flexGrow={1}>
              <GamesGrid games={dummyGames} />
            </Box>

            <Box width={{ xs: "100%", md: 380 }}>
              <LobbySidebar
                games={dummyGames}
                lobbies={dummyLobbies}
                formState={{
                  newLobbyName, setNewLobbyName,
                  selectedGame, setSelectedGame,
                  maxPlayers,   setMaxPlayers,
                  onCreate:     handleCreateLobby,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}