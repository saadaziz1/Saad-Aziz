import React, { useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import MemberCard from "../../components/ui/MemberCard";
import AddIcon from "@mui/icons-material/Add";
import { useMemberStore } from "../../stores/memberStore";
import { memberAPI } from "../../services/member.api";

export default function Members() {
  const { members, setMembers, deleteMember } = useMemberStore();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMembers();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await memberAPI.getAll();
      setMembers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this member?')) {
      try {
        await memberAPI.delete(id);
        deleteMember(id);
        setTimeout(() => fetchMembers(), 500);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Team Members</Typography>
        <Button variant="contained" startIcon={<AddIcon />} href="/members/create">Add Member</Button>
      </Box>

      <Grid container spacing={3}>
        {members.map((m) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m._id}>
            <MemberCard {...m} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
