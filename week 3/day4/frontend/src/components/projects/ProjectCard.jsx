import React, { useRef } from "react";
import { Card, CardContent, Typography, Box, Chip, IconButton, Stack } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useGSAP } from "@gsap/react";
import { staggeredEntrance, hoverEffect } from "../../animations/cardAnimations";

export default function ProjectCard({ project, onEdit, onDelete, onClick, index = 0 }) {
  const cardRef = useRef();

  useGSAP(() => {
    // Cards slide in when dashboard loads
    staggeredEntrance([cardRef.current], { 
      delay: index * 0.1,
      duration: 0.6,
      ease: "power2.out"
    });

    // Enhanced hover effects
    const cleanup = hoverEffect(cardRef.current, {
      scale: 1.02,
      boxShadow: "0px 15px 40px rgba(0,0,0,0.15)"
    });
    
    return cleanup;

  }, { scope: cardRef });

  return (
    <Card
      ref={cardRef}
      onClick={onClick}
      sx={{
        borderRadius: 3,
        boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
        backgroundColor: "background.paper", // Theme default
        color: "text.primary", // Theme default
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: '1px solid',
        borderColor: 'divider',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent)',
          transition: 'left 0.5s ease',
          zIndex: 1,
        },
        '&:hover::before': {
          left: '100%',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: "0px 15px 40px rgba(0,0,0,0.12)",
        }
      }}
    >
      {/* Decorative gradient accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          zIndex: 2,
        }}
      />

      {/* Action buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 1,
          zIndex: 3,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '.MuiCard-root:hover &': {
            opacity: 1,
          }
        }}
      >
        {onEdit && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
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
        )}
        {onDelete && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id || project._id);
            }}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                transform: 'scale(1.1)',
              }
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        )}
      </Box>

      <CardContent sx={{ flex: 1, p: 3, position: 'relative', zIndex: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            color: 'text.primary', // Theme default
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {project.title || project.name || "Loading..."}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary", // Theme default
            mb: 3,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {project.description || "Loading description..."}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Chip
            label={project.status || "active"}
            color={project.status === "active" || project.status === "In Progress" ? "success" : "default"}
            size="small"
            sx={{
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}