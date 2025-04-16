"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import { Visibility, VisibilityOff, LightMode, DarkMode } from "@mui/icons-material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LoginForm from "../components/LoginForm";
import React from "react";

interface LoginPageProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export default function LoginPage({ toggleTheme, isDarkMode }: LoginPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #121212 0%, #1E1E1E 100%)"
            : "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={theme.palette.mode === "dark" ? 8 : 2}
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "90%" : "80%",
          maxWidth: "1000px",
          height: isMobile ? "auto" : "70vh",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(58, 134, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              position: "relative",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)"
                  : "linear-gradient(135deg, #3A86FF 0%, #61A0FF 100%)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23${theme.palette.mode === "dark" ? "ffffff" : "000000"}' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <Box
              sx={{
                position: "relative",
                textAlign: "center",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                  mb: 3,
                }}
              >
                <SportsEsportsIcon
                  sx={{
                    fontSize: 80,
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>
              <Typography
                variant="h2"
                fontWeight="700"
                color="white"
                sx={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  letterSpacing: "0.05em",
                }}
              >
                GameHUB
              </Typography>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            flex: isMobile ? 1 : 0.8,
            p: isMobile ? 3 : 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 26,
              borderRadius: 13,
              backgroundColor: theme.palette.mode === "dark" ? "#1A1A2E" : "#E9ECEF",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
              padding: "2px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={toggleTheme}
          >
            <Box
              sx={{
                position: "absolute",
                left: theme.palette.mode === "dark" ? "calc(100% - 24px)" : "2px",
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: 14, color: "#3A86FF" }} />
              ) : (
                <LightMode sx={{ fontSize: 14, color: "#FFC107" }} />
              )}
            </Box>
          </Box>

          {isMobile && (
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  mb: 2,
                }}
              >
                <SportsEsportsIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h5" fontWeight="600">
                GameHUB
              </Typography>
            </Box>
          )}

          <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Welcome back
            </Typography>

            <LoginForm />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}