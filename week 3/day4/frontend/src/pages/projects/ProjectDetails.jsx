// src/pages/ProjectDetails.jsx
import React from "react";
import { Box, Paper, Typography, Chip, Stack, Avatar, Grid } from "@mui/material";

export default function ProjectDetails() {
  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 1, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>3D Product Mockups</Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>High-quality product mockups rendered with AI pipeline</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label="In Progress" color="warning" />
          <Chip label="3D" variant="outlined" />
          <Chip label="AI" variant="outlined" />
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{xs:12, md:8}} >
          <Paper sx={{ p: 3, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Overview</Typography>
            <Typography variant="body1" color="text.secondary">This project uses a custom NeRF-like pipeline to generate 3D splats from product photos and render animated showcase videos.</Typography>
          </Paper>
        </Grid>

        <Grid size={{xs:12,md:4}} >
          <Paper sx={{ p: 3, borderRadius: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Team</Typography>
            <Stack direction="row" spacing={2}>
              <Avatar src="https://i.pravatar.cc/150?img=1" />
              <Avatar src="https://i.pravatar.cc/150?img=2" />
              <Avatar src="https://i.pravatar.cc/150?img=3" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
