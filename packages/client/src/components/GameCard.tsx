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
  rating: number;
}

export default function GameCard({ id, title, imageUrl, players, category, rating }: GameCardProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardMedia component="img" height="100" image={imageUrl} alt={title} />
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="subtitle2" noWrap>{title}</Typography>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">{category}</Typography>
          <Box display="flex" alignItems="center">
            <Star sx={{ fontSize: 14, color: "#ffb400", mr: 0.5 }} />
            <Typography variant="caption">{rating}</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <People sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">{players} online</Typography>
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