"use client"

import React from "react"
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Grid,
} from "@mui/material"
import {
  Numbers as NumbersIcon,
  VideoLibrary as VideoIcon,
} from "@mui/icons-material"

export interface HowToPlayProps {
  steps: string[]
  videoLinks?: { label: string; url: string }[]
}

const HowToPlay: React.FC<HowToPlayProps> = ({ steps, videoLinks = [] }) => (
  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
    <Typography variant="h5" gutterBottom>
      How to Play
    </Typography>

    <Divider sx={{ mb: 2 }} />

    <List>
      {steps.map((step, idx) => (
        <ListItem key={idx} disableGutters>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <NumbersIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={step} />
        </ListItem>
      ))}
    </List>

    {videoLinks.length > 0 && (
      <>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Tutorial Videos
        </Typography>

        <Grid container spacing={1}>
          {videoLinks.map((v, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                component="a"
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderRadius: 1,
                  transition: "background .2s",
                  textDecoration: "none",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <VideoIcon sx={{ mr: 1 }} color="secondary" />
                <Typography variant="body2">{v.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </>
    )}
  </Paper>
)

export default HowToPlay