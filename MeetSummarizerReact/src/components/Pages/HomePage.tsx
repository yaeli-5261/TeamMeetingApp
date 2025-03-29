// import React from "react";
// import { Container, Typography, Box } from "@mui/material";

// const HomePage = () => {
//   return (
//     <Box
//       sx={{
//         py: 8,
//         textAlign: "center",
//         color: "#fff",
//         textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
//       }}
//     >
//       <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
//         Welcome to Meeting Manager
//       </Typography>
//       <Typography variant="h6" component="p">
//         Organize and manage your meetings with style.
//       </Typography>
//     </Box>
//   );
// };

// export default HomePage;





























"use client"

import { Box, Typography, Grid, Paper, useTheme } from "@mui/material"
import { motion } from "framer-motion"

export default function HomePage() {
  const theme = useTheme()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to your team meeting file management system.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
                minHeight: 200,
              }}
            >
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Upcoming Meetings
              </Typography>
              <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                {/* Placeholder content */}
                <Box sx={{ py: 1 }}>Strategy Planning - Tomorrow, 10:00 AM</Box>
                <Box sx={{ py: 1 }}>Team Standup - Wednesday, 9:30 AM</Box>
                <Box sx={{ py: 1 }}>Product Review - Friday, 2:00 PM</Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
                minHeight: 200,
              }}
            >
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Recent Files
              </Typography>
              <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                {/* Placeholder content */}
                <Box sx={{ py: 1 }}>Q1 Strategy Meeting.pdf</Box>
                <Box sx={{ py: 1 }}>Product Roadmap 2025.docx</Box>
                <Box sx={{ py: 1 }}>Team Feedback Notes.md</Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
                minHeight: 200,
              }}
            >
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Team Activity
              </Typography>
              <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                {/* Placeholder content */}
                <Box sx={{ py: 1 }}>Sarah uploaded a new file</Box>
                <Box sx={{ py: 1 }}>Alex created a meeting</Box>
                <Box sx={{ py: 1 }}>Jamie commented on Product Roadmap</Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  )
}

