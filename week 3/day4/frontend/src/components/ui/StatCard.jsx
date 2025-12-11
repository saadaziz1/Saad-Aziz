import React, { useRef } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const StatCard = ({ title, value, gradient = 'linear-gradient(45deg, #667eea, #764ba2)', index = 0 }) => {
  const cardRef = useRef();
  const valueRef = useRef();

  useGSAP(() => {
    // Staggered entrance animation on scroll
    gsap.fromTo(cardRef.current, 
      {
        y: 80,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: index * 0.15, // Stagger delay
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none" // Only play once
        }
      }
    );

    // Count-up animation triggered on scroll
    gsap.fromTo(valueRef.current, 
      { 
        innerText: 0 
      },
      {
        innerText: value,
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        delay: (index * 0.15) + 0.3, // Stagger + slight delay after card entrance
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none" // Only play once
        }
      }
    );

    // Hover effects only
    const handleMouseEnter = () => {
      gsap.to(cardRef.current, {
        boxShadow: "0px 20px 50px rgba(0,0,0,0.25), 0 0 40px rgba(255,255,255,0.1)",
        scale: 1.03,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    cardRef.current?.addEventListener('mouseenter', handleMouseEnter);
    cardRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cardRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };

  }, { scope: cardRef });

  return (
    <Card
      ref={cardRef}
      className="stat-card"
      sx={{
        borderRadius: 4,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
        background: gradient,
        color: "#fff",
        width: "100%",
        height: 200, // Fixed height for all cards
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          transition: 'left 0.6s ease',
        },
        '&:hover::before': {
          left: '100%',
        }
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 15,
          right: 15,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -15,
          left: -15,
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      />

      <CardContent
        sx={{
          textAlign: "center",
          padding: 3,
          zIndex: 2,
          position: 'relative',
          width: '100%'
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            opacity: 0.95,
            mb: 2,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px'
          }}
        >
          {title}
        </Typography>
        <Typography
          ref={valueRef}
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: "3rem",
            textShadow: '0 4px 12px rgba(0,0,0,0.4)',
            background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #e6f3ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          0
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;