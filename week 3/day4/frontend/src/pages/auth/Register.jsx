import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../services/user.api";
import { useAuthStore } from "../../stores/authStore";
import { fadeIn, staggerFadeIn } from "../../animations/gsapUtils";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const containerRef = useRef();
  const fieldsRef = useRef([]);

  useEffect(() => {
    fadeIn(containerRef.current);
    setTimeout(() => staggerFadeIn(fieldsRef.current), 200);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await userAPI.register(formData);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Paper ref={containerRef} sx={{ width: { xs: "100%", md: 720 }, borderRadius: 3, display: "flex", overflow: "hidden", boxShadow: 6 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, p: { xs: 3, md: 6 } }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Create your account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Join ProjectHub and manage your team with style.</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField 
            ref={(el) => (fieldsRef.current[0] = el)}
            label="Full Name" 
            fullWidth 
            sx={{ mb: 2 }} 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField 
            ref={(el) => (fieldsRef.current[1] = el)}
            label="Work Email" 
            type="email"
            fullWidth 
            sx={{ mb: 2 }} 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField 
            ref={(el) => (fieldsRef.current[2] = el)}
            label="Password" 
            type="password" 
            fullWidth 
            sx={{ mb: 2 }} 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Button 
            ref={(el) => (fieldsRef.current[3] = el)}
            type="submit"
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <Button variant="text" sx={{ mt: 1 }} onClick={() => navigate("/login")}>Already have an account? Sign in</Button>
        </Box>

        <Box sx={{ width: 340, background: "linear-gradient(180deg,#6C63FF,#5B50F7)", color: "#fff", p: 4, display: { xs: "none", md: "block" } }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Teamwork made joyful</Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>Invite team members, create projects, and showcase your work with beautiful animations.</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
