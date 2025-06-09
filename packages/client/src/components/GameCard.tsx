import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface GameCardProps {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

export default function GameCard({ id, title, imageUrl, category }: GameCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardMedia component="img" height="140" image={imageUrl} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {category}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/game/${id}`)}
        >
          Oyna
        </Button>
      </CardContent>
    </Card>
  );
}