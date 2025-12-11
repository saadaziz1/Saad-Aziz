import { Box, TextField, Button, Stack, MenuItem } from '@mui/material';

export default function ProjectForm({ formData, onFieldChange, onSubmit, onCancel, members = [], loading = false }) {
  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Project title"
          fullWidth
          value={formData.title || ''}
          onChange={(e) => onFieldChange('title', e.target.value)}
          required
        />
        <TextField
          label="Short description"
          fullWidth
          multiline
          rows={3}
          value={formData.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
          required
        />
        <TextField
          label="Tech stack (comma separated)"
          fullWidth
          value={formData.techStack || ''}
          onChange={(e) => onFieldChange('techStack', e.target.value)}
          required
        />
        <TextField
          select
          label="Status"
          fullWidth
          value={formData.status || 'active'}
          onChange={(e) => onFieldChange('status', e.target.value)}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
        <TextField
          select
          label="Members"
          fullWidth
          SelectProps={{ multiple: true }}
          value={formData.members || []}
          onChange={(e) => onFieldChange('members', e.target.value)}
        >
          {members.map((member) => (
            <MenuItem key={member._id} value={member._id}>{member.name}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}