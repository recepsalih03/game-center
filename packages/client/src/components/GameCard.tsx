"use client"
import React from "react"
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material"
import { People, Star } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

export interface GameCardProps {
  id: number; 
  title: string; 
  imageUrl: string; 
  players: number; 
  category: string; 
}

export default function GameCard({ id, title, imageUrl, players, category}: GameCardProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardMedia component="img" height="100" image={imageUrl} alt={title} />
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="subtitle2" noWrap>{title}</Typography>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">{category}</Typography>
        </Box>
        <Button 
          variant="contained" 
          fullWidth 
          size="small" 
          onClick={() => navigate(`/game/${id}`)}
        >
          Play Now
        </Button>
      </CardContent>
    </Card>
  )
}