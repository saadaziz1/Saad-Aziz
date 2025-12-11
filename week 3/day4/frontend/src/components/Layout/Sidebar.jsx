// src/components/layout/Sidebar.jsx
import React from "react";
import { Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, useTheme, useMediaQuery } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
    {!isMobile && <Drawer
     variant="permanent"
      anchor="left"
      sx={{
        width: { lg: 240, xl: 280 },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { lg: 240, xl: 280 },
          boxSizing: 'border-box',
          position: 'relative',
          backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <List sx={{ pt: 2 }}>
        <ListItemButton onClick={() => { navigate("/dashboard"); }}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => { navigate("/projects");  }}>
          <ListItemIcon><FolderIcon /></ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItemButton>
        <ListItemButton onClick={() => { navigate("/projects/create");  }}>
          <ListItemIcon><AddBoxIcon /></ListItemIcon>
          <ListItemText primary="Create Project" />
        </ListItemButton>
        <ListItemButton onClick={() => { navigate("/members"); }}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Team Members" />
        </ListItemButton>
      </List>
    </Drawer>}</>
  );
}
