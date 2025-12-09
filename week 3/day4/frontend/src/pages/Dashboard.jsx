import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Stack } from "@mui/material";
import StatCard from "../components/ui/StatCard";
import { projectsAPI } from "../services/projects.api";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Projects", value: 0, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { title: "Members", value: 0, gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
    { title: "Completed Projects", value: 0, gradient: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)" },
    { title: "Active Projects", value: 0, gradient: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)" },
  ]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
      fetchProjects();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await projectsAPI.getStats();
      setStats([
        { title: "Projects", value: data.data.totalProjects, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
        { title: "Members", value: data.data.teamSize, gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
        { title: "Completed Projects", value: data.data.completedProjects, gradient: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)" },
        { title: "Active Projects", value: data.data.activeProjects, gradient: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)" },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await projectsAPI.getAll();
      setProjects(data.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: "#1e2a38" }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#1e2a38" }}>
          Latest Projects
        </Typography>

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project._id}>
              <Card
                sx={{
                  borderRadius: 1,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                  ":hover": { boxShadow: "0px 8px 25px rgba(0,0,0,0.15)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                    {project.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {project.techStack?.slice(0, 2).map((tech, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: idx === 0 ? "#667eea" : "#764ba2",
                          color: "#fff",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {tech}
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
