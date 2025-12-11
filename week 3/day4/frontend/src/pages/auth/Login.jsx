import { useState, useRef } from "react";
import { Box, Paper, Typography, TextField, Button, Divider, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { userAPI } from "../../services/user.api";
import { useAuthStore } from "../../stores/authStore";
import { authFadeIn, authSlideUp, authStaggerFields } from "../../animations/authAnimations";


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const containerRef = useRef();
  const fieldsRef = useRef([]);

  const from = location.state?.from?.pathname || "/dashboard";

  useGSAP(() => {
    authFadeIn(containerRef.current);
    authSlideUp(containerRef.current, { delay: 0.2 });
    authStaggerFields(fieldsRef.current.filter(Boolean));
  }, []);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await userAPI.login(formData);
      login(data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      p: 2
    }}>
      <Paper ref={containerRef} sx={{ 
        width: { xs: "100%", sm: 540 }, 
        borderRadius: 4, 
        overflow: "hidden", 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        backgroundColor: "background.paper"
      }}>
        <Box sx={{ display: "flex", gap: 0 }}>
          <Box sx={{
            width: 220,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff",
            p: 4,
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "center"
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
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }} 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField 
              ref={(el) => (fieldsRef.current[1] = el)}
              label="Password" 
              type="password" 
              fullWidth 
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }} 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button 
              ref={(el) => (fieldsRef.current[2] = el)}
              type="submit"
              variant="contained" 
              fullWidth 
              sx={{ 
                py: 1.6, 
                mb: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                }
              }}
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
