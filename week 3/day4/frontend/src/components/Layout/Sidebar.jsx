// src/components/layout/Sidebar.jsx
import React from "react";
import { Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 280, bgcolor: "white", border: "none", px: 2, py: 3 } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 5, px: 2, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Project<span style={{ color: "#00C49A" }}>Hub</span>
        </Typography>
      </Box>

      <List disablePadding>
        <ListItemButton onClick={() => { navigate("/dashboard"); onClose(); }}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => { navigate("/projects"); onClose(); }}>
          <ListItemIcon><FolderIcon /></ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItemButton>
        <ListItemButton onClick={() => { navigate("/projects/create"); onClose(); }}>
          <ListItemIcon><AddBoxIcon /></ListItemIcon>
          <ListItemText primary="Create Project" />
        </ListItemButton>
        <ListItemButton onClick={() => { navigate("/members"); onClose(); }}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Team Members" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
