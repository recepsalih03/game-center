import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Hello from MUI 7 (React 18 + TS)
        </Typography>
        <Button variant="contained" color="primary" sx={{ mr: 1 }}>
          Primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
      </Box>
    </ThemeProvider>
  );
}

export default App;