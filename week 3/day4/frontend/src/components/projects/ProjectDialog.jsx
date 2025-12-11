import React, { useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box, Chip, Stack, Typography } from '@mui/material';
import { useGSAP } from '@gsap/react';
import { dialogFadeInScale } from '../../animations/dialogAnimations';
import { useMembers } from '../../hooks/api/useMembers';

export default function ProjectDialog({ open, onClose, project, onSave }) {
  const { members, fetchMembers } = useMembers();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    techStack: '',
    status: 'active',
    assignedMembers: []
  });
  const dialogRef = useRef();

  useEffect(() => {
    if (open && members.length === 0) {
      fetchMembers();
    }
  }, [open, members.length, fetchMembers]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || project.name || '',
        description: project.description || '',
        techStack: project.techStack?.join(', ') || '',
        status: project.status || 'active',
        assignedMembers: project.members ? project.members.map(m => typeof m === 'object' ? m._id : m) : []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        techStack: '',
        status: 'active',
        assignedMembers: []
      });
    }
  }, [project, open]);

  useGSAP(() => {
    if (open && dialogRef.current) {
      dialogFadeInScale(dialogRef.current);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s),
      status: formData.status,
      members: formData.assignedMembers
    };
    console.log(payload)
    onSave(payload);
    onClose();
  };

  const selectedMembers = members.filter(member => 
    formData.assignedMembers.includes(member._id)
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }
      }}
    >
      <Box ref={dialogRef}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {project ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Project Title"
              margin="normal"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Tech Stack (comma separated)"
              margin="normal"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              select
              label="Status"
              margin="normal"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
            
            <TextField
              fullWidth
              select
              label="Assign Members (Optional)"
              margin="normal"
              
              SelectProps={{ 
                multiple: true,
                displayEmpty: true,
                renderValue: (selected) => {
                  if (selected.length === 0) {
                    return <Box sx={{ color: 'text.secondary' }}>Select team members</Box>;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((memberId) => {
                        const member = members.find(m => m._id === memberId);
                        return (
                          <Chip 
                            key={memberId} 
                            label={member?.name} 
                            size="small"
                            sx={{ 
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              color: 'white'
                            }}
                          />
                        );
                      })}
                    </Box>
                  );
                }
              }}
              value={formData.assignedMembers}
              onChange={(e) => setFormData({ ...formData, assignedMembers: e.target.value })}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                '& .MuiInputLabel-root': { backgroundColor: 'background.paper', px: 1 }
              }}
            >
              {members.map((member) => (
                <MenuItem key={member._id} value={member._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}
                    >
                      {member.name.charAt(0)}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.role}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>


          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            {project ? 'Update' : 'Create'} Project
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}