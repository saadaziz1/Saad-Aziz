import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Stack, Chip, CircularProgress, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { dialogFadeInScale } from "../../animations/dialogAnimations";
import { showSuccessNotification } from "../../animations/notificationAnimations";
import { useMembers } from "../../hooks/api/useMembers";
import { MEMBER_ROLES } from "../../constants";

export default function EditMember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getMemberById, editMember, loading } = useMembers();
  const paperRef = useRef();
  const member = getMemberById(id);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    skills: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        role: member.role || "",
        skills: member.skills?.join(', ') || "",
        email: member.email || "",
        phone: member.phone || ""
      });
    }
  }, [member]);

  useGSAP(() => {
    dialogFadeInScale(paperRef.current, { duration: 0.6 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editMember(id, {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      });
      showSuccessNotification('Member updated successfully!');
      setTimeout(() => navigate('/app/members'), 1000);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Member not found</Typography>
        <Button onClick={() => navigate('/app/members')} sx={{ mt: 2 }}>Back to Members</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "background.default", minHeight: "100vh" }}>
      <Paper 
        ref={paperRef}
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4, 
          maxWidth: 800, 
          mx: "auto",
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Edit Team Member
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Update member information
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              fullWidth
              select
              label="Role / Title"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              {MEMBER_ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            
            <Box>
              <TextField
                fullWidth
                label="Skills (comma separated)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              {skillsArray.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Skills Preview:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {skillsArray.map((skill, idx) => (
                      <Chip 
                        key={idx}
                        label={skill} 
                        size="small"
                        sx={{ 
                          background: `linear-gradient(45deg, ${idx % 3 === 0 ? '#667eea' : idx % 3 === 1 ? '#764ba2' : '#f093fb'}, ${idx % 3 === 0 ? '#764ba2' : idx % 3 === 1 ? '#f093fb' : '#f5576c'})`,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/app/members')}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{ 
                  borderRadius: 2, 
                  px: 4,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                  }
                }}
              >
                Update Member
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}