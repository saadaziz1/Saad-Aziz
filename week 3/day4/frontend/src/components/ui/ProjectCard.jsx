// src/components/ui/ProjectCard.jsx

import { Card, CardContent, Box, Typography, Chip, Stack, IconButton } from "@mui/material";


export default function ProjectCard({ title, description, status="active", techStack=[] }) {
  return (
    <Card sx={{
      borderRadius: 1,
      boxShadow: "0 8px 30px rgba(16,24,40,0.06)",
      overflow: "visible",
      position: "relative"
    }}>
      <CardContent sx={{ position: "relative" }}>
        

        <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{description}</Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <Chip label={status} color={status === "completed" ? "success" : "warning"} size="small" />
          <Box sx={{ flex: 1 }} />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
          {techStack.map(t => <Chip key={t} label={t} variant="outlined" size="small" sx={{ mr: 1, mb: 1 }} />)}
        </Stack>
      </CardContent>
    </Card>
  );
}
