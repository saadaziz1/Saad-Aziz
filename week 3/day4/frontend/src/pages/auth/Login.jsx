import { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, TextField, Button, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../services/user.api";
import { useAuthStore } from "../../stores/authStore";
import { fadeIn, staggerFadeIn } from "../../animations/gsapUtils";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const { data } = await userAPI.login(formData);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg,#F8FAFF 0%,#FFFFFF 60%)", p: 2
    }}>
      <Paper ref={containerRef} sx={{ width: { xs: "100%", sm: 540 }, borderRadius: 3, overflow: "hidden", boxShadow: 6 }}>
        <Box sx={{ display: "flex", gap: 0 }}>
          <Box sx={{
            width: 220,
            background: "linear-gradient(180deg,#6C63FF,#5B50F7)",
            color: "#fff",
            p: 4,
            display: { xs: "none", sm: "block" }
          }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Welcome Back</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage projects and teams beautifully</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Sign in</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Enter your credentials to access your dashboard</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField 
              ref={(el) => (fieldsRef.current[0] = el)}
              label="Email" 
              type="email"
              fullWidth 
              sx={{ mb: 2 }} 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField 
              ref={(el) => (fieldsRef.current[1] = el)}
              label="Password" 
              type="password" 
              fullWidth 
              sx={{ mb: 2 }} 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button 
              ref={(el) => (fieldsRef.current[2] = el)}
              type="submit"
              variant="contained" 
              fullWidth 
              sx={{ py: 1.6, mb: 1.5 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Don't have an account? <Button variant="text" onClick={() => navigate("/register")}>Create account</Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
