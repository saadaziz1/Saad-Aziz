// src/components/ui/MemberCard.jsx
import React from "react";
import { Card, CardContent, Avatar, Typography, Stack, Chip } from "@mui/material";

export default function MemberCard({ name, role, skills = [], email }) {
  return (
    <Card sx={{ borderRadius: 1, boxShadow: 2 }}>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Avatar src={`https://i.pravatar.cc/150?u=${email}`} sx={{ width: 64, height: 64 }} />
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{name}</Typography>
          <Typography variant="caption" color="text.secondary">{role}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {skills.slice(0,4).map(s => <Chip key={s} label={s} size="small" variant="outlined" sx={{ mr:1, mb:1 }} />)}
          </Stack>
        </div>
      </CardContent>
    </Card>
  );
}
