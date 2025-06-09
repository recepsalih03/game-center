import React from "react";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface GameCardProps {
  id: number;
  title: string;
  imageUrl: string;
}

export default function GameCard({ id, title, imageUrl }: GameCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardMedia component="img" height="140" image={imageUrl} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" align="center" noWrap>
          {title}
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