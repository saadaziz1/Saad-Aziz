import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, Typography, Chip, Button, Stack, Divider, CircularProgress } from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { staggeredEntrance } from "../../animations/cardAnimations";
import ProjectDialog from "../../components/projects/ProjectDialog";
import { useProjects } from "../../hooks/api/useProjects";
import { useMembers } from "../../hooks/api/useMembers";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const containerRef = useRef();
  const elementsRef = useRef([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { projects, getProjectById, editProject, removeProject, loading, fetchProjects } = useProjects();
  const { members } = useMembers();
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      let foundProject = getProjectById(id);
      if (!foundProject && projects.length === 0) {
        await fetchProjects();
        foundProject = getProjectById(id);
      }
      setProject(foundProject);
      setProjectLoading(false);
    };
    loadProject();
  }, [id, projects, getProjectById, fetchProjects]);

  useGSAP(() => {
    staggeredEntrance(elementsRef.current, { delay: 0.1, duration: 0.6 });
  }, []);

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(id);
        navigate('/app/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleSave = async (projectData) => {
    try {
      await editProject(id, projectData);
      setProject({ ...project, ...projectData });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  if (loading || projectLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Project not found</Typography>
        <Button onClick={() => navigate('/app/projects')} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box ref={containerRef} sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "background.default", minHeight: "100vh", maxWidth: '100vw', overflow: 'hidden' }}>
      <Button
        ref={(el) => (elementsRef.current[0] = el)}
        startIcon={<ArrowBack />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 3, borderRadius: 2 }}
        
      >
        Back to Projects
      </Button>

      <Paper 
        ref={(el) => (elementsRef.current[1] = el)}
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
          }}
        />

        <Box ref={(el) => (elementsRef.current[2] = el)} sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            {project.title || project.name}
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Chip
              label={project.status}
              color={project.status === "In Progress" ? "primary" : "success"}
              sx={{ fontWeight: 600 }}
            />
            <Button
              variant="outlined"
              startIcon={<Edit />}
              size="small"
              onClick={handleEdit}
              sx={{ borderRadius: 2, }}
            >
              Edit Project
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              size="small"
              onClick={handleDelete}
              sx={{ borderRadius: 2 }}
            >
              Delete Project
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box ref={(el) => (elementsRef.current[3] = el)} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Description
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
            {project.description}
          </Typography>
        </Box>

        {project.techStack && (
          <Box ref={(el) => (elementsRef.current[4] = el)} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Technologies Used
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {project.techStack.map((tech, index) => (
                <Chip 
                  key={index}
                  label={tech} 
                  sx={{ 
                    background: `linear-gradient(45deg, ${index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#764ba2' : '#f093fb'}, ${index % 3 === 0 ? '#764ba2' : index % 3 === 1 ? '#f093fb' : '#f5576c'})`,
                    color: 'white',
                    fontWeight: 600
                  }} 
                />
              ))}
            </Stack>
          </Box>
        )}

        <Box ref={(el) => (elementsRef.current[5] = el)} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Assigned Members
          </Typography>
          {project.members && project.members.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {project.members.map((member, index) => {
                // Handle both populated objects and IDs
                const memberData = typeof member === 'object' ? member : members.find(m => m._id === member);
                return memberData ? (
                  <Chip 
                    key={memberData._id || member}
                    label={memberData.name}
                    sx={{ 
                      background: `linear-gradient(45deg, ${index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#764ba2' : '#f093fb'}, ${index % 3 === 0 ? '#764ba2' : index % 3 === 1 ? '#f093fb' : '#f5576c'})`,
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                ) : null;
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No members assigned
            </Typography>
          )}
        </Box>

        
      </Paper>

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={project}
        onSave={handleSave}
      />
    </Box>
  );
}