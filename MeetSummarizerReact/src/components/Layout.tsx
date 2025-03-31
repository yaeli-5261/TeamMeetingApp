// import React from "react";
// import { AppBar, Toolbar, Typography, Button, Avatar, Box, Container } from "@mui/material";
// import { deepOrange } from "@mui/material/colors";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Slide from "@mui/material/Slide";
// import { RootState } from "../store/store";

// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const user = useSelector((state: RootState) => state.Auth.user);
//   const navigate = useNavigate();

//   const handleSignIn = () => {
//     navigate("/login");
//   };

//   const handleMeetings = () => {
//     navigate("/meetings");
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundImage: 'url("")', // ניתן לשנות את כתובת הרקע
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       {/* תפריט עליון עם אנימציה */}
//       <Slide direction="down" in={true} mountOnEnter unmountOnExit>
//         <AppBar position="static" sx={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
//           <Toolbar>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
//               Meeting Manager
//             </Typography>
//             <Button color="inherit" onClick={handleSignIn} sx={{ marginRight: 2 }}>
//               Sign In
//             </Button>
//             <Button color="inherit" onClick={handleMeetings} sx={{ marginRight: 2 }}>
//               My Meetings
//             </Button>
//             {user?.userName && (
//               <Avatar sx={{ bgcolor: deepOrange[500], transition: "transform 0.3s", "&:hover": { transform: "scale(1.2)" } }}>
//                 {user.userName.charAt(0).toUpperCase()}
//               </Avatar>
//             )}
//           </Toolbar>
//         </AppBar>
//       </Slide>

//       {/* גוף העמוד */}
//       <Container sx={{ py: 4 }}>
//         {children}
//       </Container>
//     </Box>
//   );
// };

// export default Layout;
















// // "use client"

// // import type React from "react"
// // import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material"
// // import MenuIcon from "@mui/icons-material/Menu"
// // import { useState } from "react"
// // import { AppSidebar } from "./Pages/sideBar"

// // interface LayoutProps {
// //   children: React.ReactNode
// // }

// // export default function Layout({ children }: LayoutProps) {
// //   const theme = useTheme()
// //   const isMobile = useMediaQuery(theme.breakpoints.down("md"))
// //   const [mobileOpen, setMobileOpen] = useState(false)

// //   const handleDrawerToggle = () => {
// //     setMobileOpen(!mobileOpen)
// //   }

// //   return (
// //     <Box sx={{ display: "flex", minHeight: "100vh" }}>
// //       <CssBaseline />

// //       {/* Mobile app bar */}
// //       {isMobile && (
// //         <AppBar
// //           position="fixed"
// //           sx={{
// //             display: { xs: "block", md: "none" },
// //             bgcolor: "background.paper",
// //             color: "text.primary",
// //             boxShadow: 1,
// //             zIndex: (theme) => theme.zIndex.drawer + 1,
// //           }}
// //         >
// //           <Toolbar>
// //             <IconButton
// //               color="inherit"
// //               aria-label="open drawer"
// //               edge="start"
// //               onClick={handleDrawerToggle}
// //               sx={{ mr: 2 }}
// //             >
// //               <MenuIcon />
// //             </IconButton>
// //             <Typography variant="h6" noWrap component="div">
// //               MeetingFiles
// //             </Typography>
// //           </Toolbar>
// //         </AppBar>
// //       )}

// //       {/* Sidebar */}
// //       <AppSidebar />

// //       {/* Main content */}
// //       <Box
// //         component="main"
// //         sx={{
// //           flexGrow: 1,
// //           p: 3,
// //           width: { md: `calc(100% - 250px)` },
// //           mt: { xs: isMobile ? 8 : 0, md: 0 },
// //         }}
// //       >
// //         {children}
// //       </Box>
// //     </Box>
// //   )
// // }




"use client"

import type React from "react"

import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useState } from "react"
import { AppSidebar } from "./Pages/app-sidebar"
import { AppFooter } from "./Pages/app-footer"


interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <CssBaseline />

      {/* Mobile app bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            display: { xs: "block", md: "none" },
            bgcolor: "background.paper",
            color: "text.primary",
            boxShadow: 1,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              MeetingFiles
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Main layout container */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            ml: { xs: 0, md: "250px" }, // Add margin to account for sidebar width
            mt: { xs: isMobile ? 8 : 0, md: 0 },
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // Ensure it takes full height
            overflow: "hidden", // Prevent horizontal scrolling
          }}
        >
          {/* Content wrapper with padding */}
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 3 },
              pb: { xs: 10, md: 12 }, // Add padding at bottom to prevent footer overlap
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {children}
          </Box>

          {/* Footer */}
          <Box sx={{ width: "100%", position: "relative" }}>
            <AppFooter />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

