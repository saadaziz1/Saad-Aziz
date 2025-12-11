import React, { useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Chip, Stack, Typography, MenuItem } from '@mui/material';
import { useGSAP } from '@gsap/react';
import { dialogFadeInScale } from '../../animations/dialogAnimations';
import { MEMBER_ROLES } from '../../constants';

export default function MemberDialog({ open, onClose, member, onSave }) {
  const [formData, setFormData] = React.useState({
    name: '',
    role: '',
    skills: '',
    email: '',
    phone: ''
  });
  const dialogRef = useRef();

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        skills: member.skills?.join(', ') || '',
        email: member.email || '',
        phone: member.phone || ''
      });
    } else {
      setFormData({
        name: '',
        role: '',
        skills: '',
        email: '',
        phone: ''
      });
    }
  }, [member, open]);

  useGSAP(() => {
    if (open && dialogRef.current) {
      dialogFadeInScale(dialogRef.current);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    onSave(payload);
    onClose();
  };

  const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];

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
          {member ? 'Edit Team Member' : 'Add New Member'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              select
              label="Role / Title"
              margin="normal"
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
                margin="normal"
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
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Phone"
              margin="normal"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
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
            {member ? 'Update' : 'Create'} Member
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}