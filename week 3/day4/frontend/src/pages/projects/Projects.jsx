import React, { useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import ProjectCard from "../../components/ui/ProjectCard";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import { useProjectStore } from "../../stores/projectStore";
import { projectsAPI } from "../../services/projects.api";

export default function Projects() {
  const { projects, setProjects, deleteProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectsAPI.getAll();
      setProjects(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await projectsAPI.delete(id);
        deleteProject(id);
        setTimeout(() => fetchProjects(), 500);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Projects</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<AddIcon />} href="/projects/create">New Project</Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {projects.map(p => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p._id}>
            <ProjectCard {...p} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
