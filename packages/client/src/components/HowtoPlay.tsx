"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
  Fade,
} from "@mui/material"
import { PlayArrow, Info, VideoLibrary } from "@mui/icons-material"

interface HowToPlayProps {
  steps: string[]
  videoLinks?: { label: string; url: string }[]
}

export default function HowToPlay({ steps, videoLinks = [] }: HowToPlayProps) {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Info color="primary" />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Nasıl Oynanır?
        </Typography>
      </Box>

      {/* Steps */}
      <Fade in timeout={1000}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            background: alpha(theme.palette.background.paper, 0.5),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        fontWeight: activeStep === index ? 600 : 400,
                        color: activeStep === index ? theme.palette.primary.main : theme.palette.text.secondary,
                      },
                    }}
                  >
                    Adım {index + 1}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {step}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {index < steps.length - 1 && (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{
                            mr: 1,
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          }}
                        >
                          Devam Et
                        </Button>
                      )}
                      <Button disabled={index === 0} onClick={handleBack} sx={{ mr: 1, borderRadius: 2 }}>
                        GERİ
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length && (
              <Card
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🎉 Harika! Artık oynamaya hazırsın!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tüm adımları tamamladın. Şimdi oyuna katılabilirsin.
                </Typography>
                <Button onClick={handleReset} variant="outlined" sx={{ borderRadius: 2 }}>
                  Tekrar Oku
                </Button>
              </Card>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  )
}
