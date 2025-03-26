
//עיצוב
import React from "react";
import { Container, Typography, Box } from "@mui/material";

const HomePage = () => {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        color: "#fff",
        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
        Welcome to Meeting Manager
      </Typography>
      <Typography variant="h6" component="p">
        Organize and manage your meetings with style.
      </Typography>
    </Box>
  );
};

export default HomePage;
