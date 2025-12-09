import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Stack, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { projectsAPI } from "../../services/projects.api";
import { memberAPI } from "../../services/member.api";
import { useProjectStore } from "../../stores/projectStore";

export default function CreateProject() {
  const navigate = useNavigate();
  const { addProject } = useProjectStore();
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    status: "active",
    members: []
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await memberAPI.getAll();
      setMembers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim())
      };
      const { data } = await projectsAPI.create(payload);
      addProject(data.data);
      setTimeout(() => navigate('/projects'), 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Create new project</Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Project title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextField
            label="Short description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <TextField
            label="Tech stack (comma separated)"
            fullWidth
            value={formData.techStack}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            required
          />
          <TextField
            select
            label="Status"
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <TextField
            select
            label="Members"
            fullWidth
            SelectProps={{ multiple: true }}
            value={formData.members}
            onChange={(e) => setFormData({ ...formData, members: e.target.value })}
          >
            {members.map((member) => (
              <MenuItem key={member._id} value={member._id}>{member.name}</MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
            <Button variant="outlined" onClick={() => navigate('/projects')}>Cancel</Button>
            <Button type="submit" variant="contained">Create Project</Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
