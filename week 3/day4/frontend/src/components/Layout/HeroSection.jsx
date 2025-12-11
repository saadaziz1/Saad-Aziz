import React, { useRef } from "react";
import { Box, Typography, Button, Container, Grid, Stack } from "@mui/material";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const containerRef = useRef();
  const navigate = useNavigate()

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Text sliding animations
      tl.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.1,
      })
        .from(
          ".hero-subtitle",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .from(
          ".hero-buttons",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

      // Floating button animations
      gsap.to(".primary-btn", {
        y: -6,
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: "sine.inOut",
        delay: 1.5,
      });

      gsap.to(".secondary-btn", {
        y: -4,
        repeat: -1,
        yoyo: true,
        duration: 3.2,
        ease: "sine.inOut",
        delay: 2,
      });

      // SVG path animations
      const paths = containerRef.current?.querySelectorAll(".animated-path");
      paths?.forEach((path, index) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.5,
          delay: 1.2 + index * 0.4,
          ease: "power2.out",
        });
      });

      // Floating elements animation
      gsap.to(".floating-element", {
        y: -15,
        rotation: 5,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
        stagger: 0.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        borderRadius: 3,
        p: { xs: 4, sm: 6, md: 8 },
        m: { xs: 2, sm: 3, md: 4 },

        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Floating Background Elements */}
      <Box
        className="floating-element"
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      />
      <Box
        className="floating-element"
        sx={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        }}
      />
      <Box
        className="floating-element"
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          width: 80,
          height: 80,
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(15px)",
        }}
      />

      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid xs={12}>
            <Box
              sx={{
                color: "white",
                textAlign: "center",
                zIndex: 2,
                position: "relative",
              }}
            >
              <Typography
                className="hero-title"
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: "2.8rem",
                    sm: "3.5rem",
                    md: "4.5rem",
                    lg: "5.5rem",
                  },
                  lineHeight: 1.1,
                  mb: 3,
                  background:
                    "linear-gradient(45deg, #ffffff, #f0f8ff, #e6f3ff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                Manage Teams &
                <br />
                <Box
                  component="span"
                  sx={{ color: "#FFD700", WebkitTextFillColor: "#FFD700" }}
                >
                  Projects 
                </Box>
                {" "}Beautifully
              </Typography>

              <Typography
                className="hero-subtitle"
                variant="h5"
                sx={{
                  mb: 5,
                  opacity: 0.95,
                  fontWeight: 400,
                  fontSize: { xs: "1.2rem", md: "1.4rem" },
                  
                  mx: 'auto',
                  lineHeight: 1.6,
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                Transform your workflow with stunning animations, intuitive
                design, and powerful project management tools — all in one
                beautiful portal.
              </Typography>

              <Stack
                className="hero-buttons"
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems="center"
                justifyContent='center'
              >
                <Button
                  className="primary-btn"
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    borderRadius: 4,
                    background:
                      "linear-gradient(45deg, #FF6B6B, #FF8E53, #FF6B6B)",
                    backgroundSize: "200% 200%",
                    boxShadow: "0 10px 40px rgba(255, 107, 107, 0.4)",
                    textTransform: "none",
                    "&:hover": {
                      transform: "translateY(-3px) scale(1.02)",
                      boxShadow: "0 15px 50px rgba(255, 107, 107, 0.5)",
                      backgroundPosition: "100% 0%",
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={()=> navigate('/login')}
                >
                  Get Started
                </Button>

                <Button
                  className="secondary-btn"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleOutlineIcon />}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 4,
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    color: "white",
                    backdropFilter: "blur(20px)",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderWidth: 2,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.7)",
                      background: "rgba(255, 255, 255, 0.2)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 30px rgba(255, 255, 255, 0.2)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={()=> navigate('/login')}
                >
                  Sign In
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                position: "relative",
              }}
            >
              <svg
                width="800"
                viewBox="0 0 700 300"
                style={{
                  maxWidth: "600px",
                  filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))",
                }}
              >
                <defs>
                  <linearGradient
                    id="gradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#FF6B6B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient
                    id="gradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#764ba2" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Main flowing paths */}
                <path
                  className="animated-path"
                  d="M50 250 Q200 150, 400 200 T650 250"
                  stroke="url(#gradient1)"
                  strokeWidth="6"
                  fill="none"
                  filter="url(#glow)"
                />

                <path
                  className="animated-path"
                  d="M50 300 Q250 200, 450 250 T650 300"
                  stroke="url(#gradient2)"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.8"
                />

                <path
                  className="animated-path"
                  d="M100 180 Q300 100, 500 150 T650 200"
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="3"
                  fill="none"
                />

                {/* Animated circles */}
                <circle cx="150" cy="220" r="12" fill="#FFD700" opacity="0.8">
                  <animate
                    attributeName="r"
                    values="8;15;8"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="400" cy="200" r="10" fill="#FF6B6B" opacity="0.7">
                  <animate
                    attributeName="r"
                    values="6;12;6"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="550" cy="250" r="14" fill="#4ECDC4" opacity="0.6">
                  <animate
                    attributeName="r"
                    values="10;18;10"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Abstract geometric shapes */}
                <polygon
                  points="500,100 550,120 530,170 480,150"
                  fill="rgba(255, 255, 255, 0.15)"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 515 135;360 515 135"
                    dur="20s"
                    repeatCount="indefinite"
                  />
                </polygon>

                <rect
                  x="200"
                  y="350"
                  width="40"
                  height="40"
                  rx="8"
                  fill="rgba(255, 215, 0, 0.2)"
                  stroke="rgba(255, 215, 0, 0.5)"
                  strokeWidth="2"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 220 370;-360 220 370"
                    dur="15s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
