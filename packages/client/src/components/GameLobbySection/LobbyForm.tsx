import React, { useState } from "react"
import { Paper, Typography, TextField, Button } from "@mui/material"
import { Add } from "@mui/icons-material"

interface Props { onCreate: (name:string,max:number)=>void }
const LobbyForm:React.FC<Props> = ({ onCreate })=>{
  const [name,setName] = useState("")
  const [max,setMax]   = useState(4)

  return(
    <Paper sx={{ p:3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>Create Lobby</Typography>
      <TextField fullWidth margin="dense" size="small"
        label="Lobby Name" value={name} onChange={e=>setName(e.target.value)} />
      <TextField fullWidth margin="dense" size="small" type="number"
        label="Max Players" value={max}
        InputProps={{ inputProps:{min:2,max:10} }}
        onChange={e=>setMax(Number(e.target.value))}/>
      <Button fullWidth sx={{ mt:2 }} startIcon={<Add/>}
        variant="contained" color="success"
        onClick={()=>{ onCreate(name,max); setName(""); setMax(4) }}>
        Create Lobby
      </Button>
    </Paper>
  )
}
export default LobbyForm