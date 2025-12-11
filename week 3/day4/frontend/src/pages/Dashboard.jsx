import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Button, Fab, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDialog from "../components/projects/ProjectDialog";
import { useProjects } from "../hooks/api/useProjects";
import { useMembers } from "../hooks/api/useMembers";
import { useStats } from "../hooks/api/useStats";

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, fetchProjects, createProject, editProject, removeProject } = useProjects();
  const { fetchMembers } = useMembers();
  const { stats, loading: statsLoading, fetchStats } = useStats();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchMembers();
    fetchStats();
  }, []);

  const recentProjects = projects.slice(0, 3);

  const handleProjectClick = (project) => {
    navigate(`/projects/${project._id}`);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await editProject(editingProject._id, projectData);
      } else {
        await createProject(projectData);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Dashboard
      </Typography>

      {statsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard {...stat} index={index} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Latest Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProject}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
            }
          }}
        >
          Add Project
        </Button>
      </Box>

      {projectsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {recentProjects.map((project, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project._id}>
              <ProjectCard 
                project={project} 
                index={index}
                onClick={() => handleProjectClick(project)}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        onClick={handleAddProject}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
      >
        <Add />
      </Fab>

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={editingProject}
        onSave={handleSaveProject}
      />
    </Box>
  );
};

export default Dashboard;