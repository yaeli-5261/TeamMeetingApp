// "use client"

// import { Box, Container, Typography, Link, IconButton, Divider, useMediaQuery, useTheme } from "@mui/material"
// import { GitHub as GitHubIcon, Twitter as TwitterIcon, LinkedIn as LinkedInIcon } from "@mui/icons-material"

// export function AppFooter() {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"))

//   return (
//     <Box
//       component="footer"
//       sx={{
//         py: 3,
//         px: 2,
//         mt: "auto",
//         bgcolor: "background.paper",
//         borderTop: "1px solid",
//         borderColor: "divider",
//         width: { xs: "100%", md: "calc(100% - 250px)" },
//         ml: { xs: 0, md: "250px" },
//         boxSizing: "border-box",
//         transition: "margin 0.3s, width 0.3s",
//       }}
//     >
//       <Container
//         maxWidth={false}
//         disableGutters
//         sx={{
//           px: { xs: 2, sm: 3 },
//           width: "100%",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isMobile ? "column" : "row",
//             justifyContent: "space-between",
//             alignItems: isMobile ? "center" : "flex-start",
//             gap: 2,
//           }}
//         >
//           <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
//             <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
//               MeetingFiles
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               מערכת לניהול פגישות וקבצים
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               © {new Date().getFullYear()} כל הזכויות שמורות
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-end" }}>
//             <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
//               <IconButton
//                 size="small"
//                 aria-label="GitHub"
//                 component="a"
//                 href="https://github.com/yaeli-5261"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 sx={{
//                   color: "text.secondary",
//                   "&:hover": {
//                     color: "#10a37f",
//                   },
//                 }}
//               >
//                 <GitHubIcon fontSize="small" />
//               </IconButton>
//               <IconButton size="small" aria-label="Twitter" sx={{ color: "text.secondary" }}>
//                 <TwitterIcon fontSize="small" />
//               </IconButton>
//               <IconButton size="small" aria-label="LinkedIn" sx={{ color: "text.secondary" }}>
//                 <LinkedInIcon fontSize="small" />
//               </IconButton>
//             </Box>

//             <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
//               <Link href="#" underline="hover" color="text.secondary" variant="body2">
//                 עזרה ותמיכה
//               </Link>
//               <Link href="#" underline="hover" color="text.secondary" variant="body2">
//                 תנאי שימוש
//               </Link>
//               <Link href="#" underline="hover" color="text.secondary" variant="body2">
//                 פרטיות
//               </Link>
//             </Box>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         <Box
//           sx={{
//             width: "100%",
//             height: 3,
//             background: "linear-gradient(90deg, #10a37f 0%, #0e8a6c 100%)",
//             borderRadius: 1,
//             opacity: 0.7,
//           }}
//         />
//       </Container>
//     </Box>
//   )
// }



"use client"

import { Box, Container, Typography, Link, IconButton, Divider, useMediaQuery, useTheme } from "@mui/material"
import { GitHub as GitHubIcon, Twitter as TwitterIcon, LinkedIn as LinkedInIcon } from "@mui/icons-material"

export function AppFooter() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        width: { xs: "100%", md: "calc(100% - 250px)" },
        ml: { xs: 0, md: "250px" },
        boxSizing: "border-box",
        transition: "margin 0.3s, width 0.3s",
        position: "relative",
        bottom: 0,
        zIndex: 10,
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 2, sm: 3 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
              MeetingFiles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Meeting and File Management System
            </Typography>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} All Rights Reserved
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-end" }}>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <IconButton
                size="small"
                aria-label="GitHub"
                component="a"
                href="https://github.com/yaeli-5261"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "#10a37f",
                  },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Twitter" sx={{ color: "text.secondary" }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="LinkedIn" sx={{ color: "text.secondary" }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="#" underline="hover" color="text.secondary" variant="body2">
                Help & Support
              </Link>
              <Link href="#" underline="hover" color="text.secondary" variant="body2">
                Terms of Use
              </Link>
              <Link href="#" underline="hover" color="text.secondary" variant="body2">
                Privacy
              </Link>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            width: "100%",
            height: 3,
            background: "linear-gradient(90deg, #10a37f 0%, #0e8a6c 100%)",
            borderRadius: 1,
            opacity: 0.7,
          }}
        />
      </Container>
    </Box>
  )
}

export default AppFooter
