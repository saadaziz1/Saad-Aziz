import React, { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Chip,
  Stack,
  Fab,
  CircularProgress
} from "@mui/material";
import { Add, Edit, Delete, Person } from "@mui/icons-material";
import { useGSAP } from "@gsap/react";
import { staggeredEntrance } from "../../animations/cardAnimations";
import { showSuccessNotification, animateTableRow } from "../../animations/notificationAnimations";
import MemberDialog from "../../components/members/MemberDialog";
import { useMembers } from "../../hooks/api/useMembers";

export default function Members() {
  const { members, loading, fetchMembers, createMember, editMember, removeMember } = useMembers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const tableRef = useRef();
  const rowRefs = useRef([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  useGSAP(() => {
    staggeredEntrance([tableRef.current], { delay: 0.2 });
  }, []);

  const handleAddMember = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleSaveMember = async (memberData) => {
    try {
      if (editingMember) {
        await editMember(editingMember._id, memberData);
        showSuccessNotification('Member updated successfully!');
      } else {
        await createMember(memberData);
        showSuccessNotification('Member created successfully!');
      }
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const memberRow = rowRefs.current.find(ref => ref?.dataset?.memberId === memberId.toString());
      
      if (memberRow) {
        animateTableRow(memberRow, 'remove');
        setTimeout(async () => {
          try {
            await removeMember(memberId);
            showSuccessNotification('Member deleted successfully!');
          } catch (error) {
            console.error('Error deleting member:', error);
          }
        }, 400);
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "background.default", minHeight: "100vh",maxWidth: '100vw', overflow: 'hidden' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Team Members</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddMember}
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
          Add Member
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        ref={tableRef}
        sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
           overflowX: { xs: 'auto', sm: 'hidden' }
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Skills</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Phone</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : members.map((member, index) => (
              <TableRow 
                key={member._id}
                ref={(el) => {
                  if (el) {
                    rowRefs.current[index] = el;
                    el.dataset.memberId = member._id.toString();
                  }
                }}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s ease'
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: 'action.selected'
                  }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${index % 2 === 0 ? '#667eea' : '#764ba2'}, ${index % 2 === 0 ? '#764ba2' : '#f093fb'})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700
                      }}
                    >
                      {member.name.charAt(0)}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={member.role} 
                    size="small"
                    sx={{ 
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {member.skills.slice(0, 2).map((skill, idx) => (
                      <Chip 
                        key={idx}
                        label={skill} 
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {member.skills.length > 2 && (
                      <Chip 
                        label={`+${member.skills.length - 2}`} 
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{member.email}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{member.phone}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditMember(member)}
                      sx={{
                        backgroundColor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)',
              }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteMember(member._id)}
                      sx={{
                       backgroundColor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)',
              }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        onClick={handleAddMember}
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

      <MemberDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        member={editingMember}
        onSave={handleSaveMember}
      />
    </Box>
  );
}