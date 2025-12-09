import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { memberAPI } from "../../services/member.api";
import { useMemberStore } from "../../stores/memberStore";

export default function CreateMember() {
  const navigate = useNavigate();
  const { addMember } = useMemberStore();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    skills: "",
    email: "",
    phone: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      };
      const { data } = await memberAPI.create(payload);
      addMember(data.data);
      setTimeout(() => navigate('/members'), 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Add team member</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Full name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            label="Role / Title"
            fullWidth
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
          <TextField
            label="Skills (comma separated)"
            fullWidth
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            label="Phone"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/members')}>Cancel</Button>
            <Button type="submit" variant="contained">Add Member</Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
