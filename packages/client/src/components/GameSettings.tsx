"use client"

import React, { useState } from "react"
import {
  Paper,
  Typography,
  Grid,
  Slider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Box,
  Button,
} from "@mui/material"

export interface GameSettingsProps {
  defaultVolume?: number
  defaultQuality?: "Low" | "Medium" | "High" | "Ultra"
  defaultFullscreen?: boolean
  onSave?: (s: { volume: number; quality: "Low" | "Medium" | "High" | "Ultra"; fullscreen: boolean }) => void
}

const GameSettings: React.FC<GameSettingsProps> = ({
  defaultVolume = 70,
  defaultQuality = "High",
  defaultFullscreen = true,
  onSave,
}) => {
  const [volume, setVolume]         = useState<number>(defaultVolume)
  const [quality, setQuality]       = useState<"Low" | "Medium" | "High" | "Ultra">(defaultQuality)
  const [fullscreen, setFullscreen] = useState<boolean>(defaultFullscreen)

  const handleSave = () => onSave?.({ volume, quality, fullscreen })

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Game Settings
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" gutterBottom>
            Master Volume
          </Typography>
          <Slider
            value={volume}
            onChange={(_, v) => setVolume(v as number)}
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="quality-label">Graphics Quality</InputLabel>
            <Select
              labelId="quality-label"
              label="Graphics Quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as typeof quality)}
            >
              {["Low", "Medium", "High", "Ultra"].map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }} display="flex" alignItems="center">
          <FormControlLabel
            control={<Switch checked={fullscreen} onChange={(e) => setFullscreen(e.target.checked)} />}
            label="Fullscreen Mode"
          />
        </Grid>
      </Grid>

      <Box mt={3} textAlign="right">
        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Paper>
  )
}

export default GameSettings