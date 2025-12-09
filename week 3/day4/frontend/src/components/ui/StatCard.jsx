import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ title, value, gradient }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        background: gradient,
        color: "#fff",
        width: "100%", // full width of Grid column
        minHeight: 140, // same height for all cards
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          padding: { xs: 2, sm: 3, md: 4 }, // responsive padding
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" }, // responsive font
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mt: 1,
            fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" }, // responsive font
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
