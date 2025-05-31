import React from "react"
import { Paper, Typography, Divider, Box } from "@mui/material"

interface Item { id:number; date:string; result:string }
interface Props { history: Item[] }
const GameHistory:React.FC<Props>=({ history })=>(
  <Paper sx={{ p:3 }} elevation={2}>
    <Typography variant="h6">Match History</Typography>
    {history.map(h=>(
      <Box key={h.id} py={1}>
        <Box display="flex" justifyContent="space-between">
          <Typography>{h.date}</Typography><Typography fontWeight={600}>{h.result}</Typography>
        </Box><Divider/>
      </Box>
    ))}
  </Paper>
)
export default GameHistory