import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/Layout/HeroSection';
import DarkLightToggle from '../components/ui/DarkLightTheme';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer", fontWeight: 700 }}
            onClick={() => navigate("/")}
          >
            Project <span style={{ color: "#00C49A" }}>Manager</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DarkLightToggle />
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{ fontWeight: 600 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{ 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                fontWeight: 600
              }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <HeroSection />
    </Box>
  );
}