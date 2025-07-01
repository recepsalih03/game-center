import { Grid, Typography, Box, Fade } from "@mui/material"
import GameCard from "./GameCard"
import type { Game } from "../services/gamesService"

interface Props {
  games: Game[]
}

export default function GamesGrid({ games }: Props) {
  return (
    <Box>

      <Grid container spacing={3}>
        {games.map((game, index) => (
          <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <Fade in timeout={800 + index * 200}>
              <Box>
                <GameCard {...game} />
              </Box>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
