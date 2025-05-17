// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   Button,
//   useMediaQuery,
//   useTheme,
//   Avatar,
//   Menu,
//   MenuItem,
//   IconButton,
//   Divider,
//   Tooltip,
//   CircularProgress,
// } from "@mui/material"
// import {
//   Home as HomeIcon,
//   Message as MessageIcon,
//   Settings as SettingsIcon,
//   Add as AddIcon,
//   Login as LoginIcon,
//   Logout as LogoutIcon,
//   Person as PersonIcon,
//   Description as DescriptionIcon,
//   Menu as MenuIcon,
//   InsertDriveFile as FileIcon,
//   PictureAsPdf as PdfIcon,
//   Article as DocIcon,
//   Image as ImageIcon,
//   TextSnippet as TextIcon,
// } from "@mui/icons-material"
// import { useSelector, useDispatch } from "react-redux"
// import type { RootState, AppDispatch } from "../../store/store"
// import { logout } from "../../store/authSlice"
// import { fetchMeetingsByTeam } from "../../store/meetingSlice"
// import { getCookie } from "../../services/meetingService"

// // Define the navigation items
// const navItems = [
//   { name: "דף הבית", path: "/", icon: <HomeIcon /> },
//   { name: "פגישות", path: "/meetings", icon: <MessageIcon /> },
//   // { name: "יומן", path: "/calendar", icon: <CalendarIcon /> },
//   // { name: "קבצים", path: "/files", icon: <FolderIcon /> },
//   // { name: "צוות", path: "/team", icon: <TeamIcon /> },
// ]

// // Interface for recent file
// interface RecentFile {
//   name: string
//   path: string
//   meetingId: number
//   fileType: string
//   date: Date
// }

// export function AppSidebar() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const theme = useTheme()
//   const dispatch = useDispatch<AppDispatch>()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const { user, loading: authLoading } = useSelector((state: RootState) => state.Auth)
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])
//   const [loadingFiles, setLoadingFiles] = useState(false)

//   // Get meetings from Redux store
//   const meetings = useSelector((state: RootState) => state.meetings.list)

//   // בדיקה אם המשתמש מחובר בעת טעינת הקומפוננטה
//   useEffect(() => {
//     const userData = sessionStorage.getItem("user")
//     const token = getCookie("auth_token")
//     setIsLoggedIn(!!(userData && token && user && user.userName))
//   }, [user])

//   // Fetch meetings and extract recent files
//   useEffect(() => {
//     if (isLoggedIn && user?.teamId) {
//       setLoadingFiles(true)

//       // Fetch meetings if not already loaded
//       if (meetings.length === 0) {
//         dispatch(fetchMeetingsByTeam({ teamId: user.teamId }))
//           .unwrap()
//           .then((fetchedMeetings) => {
//             extractRecentFiles(fetchedMeetings)
//           })
//           .catch((error) => {
//             console.error("Error fetching meetings:", error)
//           })
//           .finally(() => {
//             setLoadingFiles(false)
//           })
//       } else {
//         // Use already loaded meetings
//         extractRecentFiles(meetings)
//         setLoadingFiles(false)
//       }
//     }
//   }, [isLoggedIn, user, meetings.length, dispatch])

//   // Extract recent files from meetings
//   const extractRecentFiles = (meetingsData: any[]) => {
//     const files: RecentFile[] = []

//     meetingsData.forEach((meeting) => {
//       // Check for original file
//       if (meeting.linkOrinignFile) {
//         const fileName = meeting.linkOrinignFile.split("/").pop() || "קובץ"
//         const fileType = getFileType(fileName)

//         files.push({
//           name: fileName,
//           path: `/meeting-details/${meeting.id}`,
//           meetingId: meeting.id,
//           fileType: fileType,
//           date: new Date(meeting.date),
//         })
//       }

//       // Check for transcript file
//       if (meeting.linkTranscriptFile) {
//         const fileName = meeting.linkTranscriptFile.split("/").pop() || "תמלול"
//         const fileType = getFileType(fileName)

//         files.push({
//           name: `תמלול - ${fileName}`,
//           path: `/meeting-details/${meeting.id}`,
//           meetingId: meeting.id,
//           fileType: fileType,
//           date: new Date(meeting.date),
//         })
//       }
//     })

//     // Sort by date (newest first) and take the first 5
//     const sortedFiles = files.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)
//     setRecentFiles(sortedFiles)
//   }

//   // Get file type icon based on extension
//   const getFileType = (fileName: string): string => {
//     const extension = fileName.split(".").pop()?.toLowerCase() || ""

//     if (["pdf"].includes(extension)) return "pdf"
//     if (["doc", "docx"].includes(extension)) return "doc"
//     if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image"
//     if (["txt", "md"].includes(extension)) return "text"

//     return "file"
//   }

//   // Get file icon based on file type
//   const getFileIcon = (fileType: string) => {
//     switch (fileType) {
//       case "pdf":
//         return <PdfIcon fontSize="small" sx={{ color: "#f44336" }} />
//       case "doc":
//         return <DocIcon fontSize="small" sx={{ color: "#2196f3" }} />
//       case "image":
//         return <ImageIcon fontSize="small" sx={{ color: "#4caf50" }} />
//       case "text":
//         return <TextIcon fontSize="small" sx={{ color: "#ff9800" }} />
//       default:
//         return <FileIcon fontSize="small" sx={{ color: "#757575" }} />
//     }
//   }

//   // עבור תפריט המשתמש
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const open = Boolean(anchorEl)

//   const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen)
//   }

//   const handleNavigation = (path: string) => {
//     navigate(path)
//     if (isMobile) {
//       setMobileOpen(false)
//     }
//   }

//   // עדכון פונקציית ה-handleLogout כדי לוודא שהמשתמש מתנתק לחלוטין
//   const handleLogout = () => {
//     // הפעלת פעולת ההתנתקות ב-Redux
//     dispatch(logout())

//     // מחיקת ה-token מה-cookies
//     document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

//     // מחיקת נתוני המשתמש מה-sessionStorage
//     sessionStorage.removeItem("user")

//     // סגירת התפריט
//     handleClose()

//     // עדכון מצב ההתחברות
//     setIsLoggedIn(false)

//     // ניווט לדף הבית
//     navigate("/")
//   }

//   const handleLogin = () => {
//     navigate("/login")
//     if (isMobile) {
//       setMobileOpen(false)
//     }
//   }

//   const isActive = (path: string) => {
//     return location.pathname === path || location.pathname.startsWith(path + "/")
//   }

//   // Mobile menu button
//   const mobileMenuButton = (
//     <IconButton
//       color="inherit"
//       aria-label="open drawer"
//       edge="start"
//       onClick={handleDrawerToggle}
//       sx={{
//         display: { xs: "block", md: "none" },
//         position: "fixed",
//         top: 10,
//         right: 10,
//         zIndex: 1200,
//         bgcolor: "background.paper",
//         boxShadow: 2,
//       }}
//     >
//       <MenuIcon />
//     </IconButton>
//   )

//   const drawerContent = (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//         width: 250,
//         bgcolor: "background.paper",
//       }}
//     >
//       {/* App Logo/Title */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           p: 2,
//           borderBottom: "1px solid",
//           borderColor: "divider",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width: 36,
//             height: 36,
//             borderRadius: "50%",
//             background: "linear-gradient(135deg, #10a37f, #0e8a6c)",
//             mr: 1.5,
//           }}
//         >
//           <DescriptionIcon sx={{ color: "white", fontSize: 20 }} />
//         </Box>
//         <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
//           MeetingFiles
//         </Typography>
//       </Box>

//       {/* User Profile / Login Section */}
//       <Box
//         sx={{
//           p: 2,
//           borderBottom: "1px solid",
//           borderColor: "divider",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         {isLoggedIn ? (
//           <>
//             <Box
//               onClick={handleUserClick}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1.5,
//                 cursor: "pointer",
//                 width: "100%",
//                 p: 1,
//                 borderRadius: 1,
//                 "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
//               }}
//             >
//               <Avatar
//                 sx={{
//                   width: 32,
//                   height: 32,
//                   bgcolor: "#10a37f",
//                 }}
//               >
//                 {user?.userName ? user.userName.charAt(0).toUpperCase() : <PersonIcon />}
//               </Avatar>
//               <Box sx={{ overflow: "hidden" }}>
//                 <Typography variant="body2" fontWeight={500} noWrap>
//                   {user?.userName || "משתמש"}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" noWrap>
//                   {user?.email || "מחובר"}
//                 </Typography>
//               </Box>
//             </Box>

//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "right",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//             >
//               <MenuItem onClick={handleLogout}>
//                 <ListItemIcon>
//                   <LogoutIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>התנתקות</ListItemText>
//               </MenuItem>
//             </Menu>
//           </>
//         ) : (
//           <Box sx={{ width: "100%" }}>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               משתמש לא מחובר
//             </Typography>
//             <Button
//               onClick={() => navigate("/login")}
//               variant="outlined"
//               startIcon={<LoginIcon />}
//               fullWidth
//               sx={{
//                 justifyContent: "flex-start",
//                 textTransform: "none",
//                 borderColor: "#10a37f",
//                 color: "#10a37f",
//                 "&:hover": {
//                   borderColor: "#0e8a6c",
//                   bgcolor: "rgba(16, 163, 127, 0.04)",
//                 },
//               }}
//             >
//               SIGN IN
//             </Button>
//           </Box>
//         )}
//       </Box>

//       {/* Main Navigation */}
//       <List sx={{ flexGrow: 0, pt: 1 }}>
//         {navItems.map((item) => (
//           <ListItem key={item.name} disablePadding>
//             <ListItemButton
//               onClick={() => handleNavigation(item.path)}
//               selected={isActive(item.path)}
//               sx={{
//                 borderRadius: 1,
//                 mx: 1,
//                 "&.Mui-selected": {
//                   bgcolor: "rgba(16, 163, 127, 0.08)",
//                   color: "#10a37f",
//                   "&:hover": {
//                     bgcolor: "rgba(16, 163, 127, 0.12)",
//                   },
//                   "& .MuiListItemIcon-root": {
//                     color: "#10a37f",
//                   },
//                 },
//                 "&:hover": {
//                   bgcolor: "rgba(0, 0, 0, 0.04)",
//                 },
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? "#10a37f" : "inherit" }}>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.name} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>

//       {/* Recent Files Section */}
//       <Box sx={{ flexGrow: 1, overflow: "auto", px: 2, py: 1 }}>
//         <Typography
//           variant="caption"
//           color="text.secondary"
//           sx={{
//             display: "block",
//             fontWeight: 500,
//             px: 1,
//             mb: 1,
//           }}
//         >
//           קבצים אחרונים
//         </Typography>

//         {loadingFiles ? (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
//             <CircularProgress size={24} sx={{ color: "#10a37f" }} />
//           </Box>
//         ) : recentFiles.length > 0 ? (
//           <List dense disablePadding>
//             {recentFiles.map((file, index) => (
//               <ListItem key={`${file.meetingId}-${index}`} disablePadding>
//                 <Tooltip title={`פגישה: ${meetings.find((m) => m.id === file.meetingId)?.name || ""}`} placement="left">
//                   <ListItemButton
//                     onClick={() => handleNavigation(file.path)}
//                     sx={{
//                       borderRadius: 1,
//                       py: 0.5,
//                       px: 1,
//                     }}
//                   >
//                     <ListItemIcon sx={{ minWidth: 30 }}>{getFileIcon(file.fileType)}</ListItemIcon>
//                     <ListItemText
//                       primary={file.name}
//                       primaryTypographyProps={{
//                         variant: "body2",
//                         noWrap: true,
//                       }}
//                     />
//                   </ListItemButton>
//                 </Tooltip>
//               </ListItem>
//             ))}
//           </List>
//         ) : isLoggedIn ? (
//           <Box sx={{ textAlign: "center", py: 2, px: 1 }}>
//             <Typography variant="body2" color="text.secondary">
//               אין קבצים אחרונים להצגה
//             </Typography>
//           </Box>
//         ) : (
//           <Box sx={{ textAlign: "center", py: 2, px: 1 }}>
//             <Typography variant="body2" color="text.secondary">
//               התחבר כדי לראות קבצים אחרונים
//             </Typography>
//           </Box>
//         )}
//       </Box>

//       {/* Bottom Actions */}
//       <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
//         {isLoggedIn ? (
//           <>
//             <Button
//               variant="contained"
//               fullWidth
//               startIcon={<AddIcon />}
//               onClick={() => handleNavigation("/add-meeting")}
//               sx={{
//                 bgcolor: "#10a37f",
//                 color: "white",
//                 textTransform: "none",
//                 fontWeight: 500,
//                 mb: 1,
//                 "&:hover": {
//                   bgcolor: "#0e8a6c",
//                 },
//               }}
//             >
//               פגישה חדשה
//             </Button>
//             <Button
//               variant="outlined"
//               fullWidth
//               startIcon={<LogoutIcon />}
//               onClick={handleLogout}
//               sx={{
//                 borderColor: "#ff5252",
//                 color: "#ff5252",
//                 textTransform: "none",
//                 fontWeight: 500,
//                 mt: 1,
//                 "&:hover": {
//                   bgcolor: "rgba(255, 82, 82, 0.04)",
//                   borderColor: "#ff3333",
//                 },
//               }}
//             >
//               התנתקות
//             </Button>
//           </>
//         ) : (
//           <Button
//             variant="contained"
//             fullWidth
//             startIcon={<LoginIcon />}
//             onClick={() => navigate("/login")}
//             sx={{
//               bgcolor: "#10a37f",
//               color: "white",
//               textTransform: "none",
//               fontWeight: 500,
//               "&:hover": {
//                 bgcolor: "#0e8a6c",
//               },
//             }}
//           >
//             SIGN IN
//           </Button>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <ListItem disablePadding>
//           <ListItemButton
//             onClick={() => handleNavigation("/settings")}
//             sx={{
//               borderRadius: 1,
//               py: 0.75,
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <SettingsIcon />
//             </ListItemIcon>
//             <ListItemText primary="הגדרות" />
//           </ListItemButton>
//         </ListItem>
//       </Box>
//     </Box>
//   )

//   return (
//     <>
//       {/* Mobile menu button */}
//       {isMobile && mobileMenuButton}

//       {/* Mobile drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true, // Better open performance on mobile
//         }}
//         sx={{
//           display: { xs: "block", md: "none" },
//           "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
//           zIndex: 1300,
//         }}
//       >
//         {drawerContent}
//       </Drawer>

//       {/* Desktop drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: { xs: "none", md: "block" },
//           width: 250,
//           flexShrink: 0,
//           position: "fixed",
//           zIndex: 1100,
//           height: "100%",
//           "& .MuiDrawer-paper": {
//             boxSizing: "border-box",
//             width: 250,
//             borderRight: "1px solid",
//             borderColor: "divider",
//             position: "fixed",
//             height: "100%",
//           },
//         }}
//         open
//       >
//         {drawerContent}
//       </Drawer>
//     </>
//   )
// }



"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material"
import {
  Home as HomeIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Menu as MenuIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Article as DocIcon,
  Image as ImageIcon,
  TextSnippet as TextIcon,
} from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../store/store"
import { logout } from "../../store/authSlice"
import { fetchMeetingsByTeam } from "../../store/meetingSlice"
import { getCookie } from "../../services/meetingService"

// Define the navigation items
const navItems = [
  { name: "Dashboard", path: "/", icon: <HomeIcon /> },
  { name: "Meetings", path: "/meetings", icon: <MessageIcon /> },
]

// Interface for recent file
interface RecentFile {
  name: string
  path: string
  meetingId: number
  fileType: string
  date: Date
}

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, loading: authLoading } = useSelector((state: RootState) => state.Auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)

  // Get meetings from Redux store
  const meetings = useSelector((state: RootState) => state.meetings.list)

  // Check if user is logged in when component loads
  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    const token = getCookie("auth_token")
    setIsLoggedIn(!!(userData && token && user && user.userName))
  }, [user])

  // Fetch meetings and extract recent files
  useEffect(() => {
    if (isLoggedIn && user?.teamId) {
      setLoadingFiles(true)

      // Fetch meetings if not already loaded
      if (meetings.length === 0) {
        dispatch(fetchMeetingsByTeam({ teamId: user.teamId }))
          .unwrap()
          .then((fetchedMeetings) => {
            extractRecentFiles(fetchedMeetings)
          })
          .catch((error) => {
            console.error("Error fetching meetings:", error)
          })
          .finally(() => {
            setLoadingFiles(false)
          })
      } else {
        // Use already loaded meetings
        extractRecentFiles(meetings)
        setLoadingFiles(false)
      }
    }
  }, [isLoggedIn, user, meetings, dispatch])

  // Extract recent files from meetings
  const extractRecentFiles = (meetingsData: any[]) => {
    const files: RecentFile[] = []

    meetingsData.forEach((meeting) => {
      // Check for original file
      if (meeting.linkOrinignFile) {
        const fileName = meeting.linkOrinignFile.split("/").pop() || "File"
        const fileType = getFileType(fileName)

        files.push({
          name: fileName,
          path: `/meeting-details/${meeting.id}`,
          meetingId: meeting.id,
          fileType: fileType,
          date: new Date(meeting.date),
        })
      }

      // Check for transcript file
      if (meeting.linkTranscriptFile) {
        const fileName = meeting.linkTranscriptFile.split("/").pop() || "Summary"
        const fileType = getFileType(fileName)

        files.push({
          name: `Summary - ${fileName}`,
          path: `/meeting-details/${meeting.id}`,
          meetingId: meeting.id,
          fileType: fileType,
          date: new Date(meeting.date),
        })
      }
    })

    // Sort by date (newest first) and take the first 5
    const sortedFiles = files.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)
    setRecentFiles(sortedFiles)
  }

  // Get file type icon based on extension
  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || ""

    if (["pdf"].includes(extension)) return "pdf"
    if (["doc", "docx"].includes(extension)) return "doc"
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image"
    if (["txt", "md"].includes(extension)) return "text"

    return "file"
  }

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <PdfIcon fontSize="small" sx={{ color: "#f44336" }} />
      case "doc":
        return <DocIcon fontSize="small" sx={{ color: "#2196f3" }} />
      case "image":
        return <ImageIcon fontSize="small" sx={{ color: "#4caf50" }} />
      case "text":
        return <TextIcon fontSize="small" sx={{ color: "#ff9800" }} />
      default:
        return <FileIcon fontSize="small" sx={{ color: "#757575" }} />
    }
  }

  // For user menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  // Update handleLogout function to ensure user is completely logged out
  const handleLogout = () => {
    // Dispatch logout action in Redux
    dispatch(logout())

    // Delete token from cookies
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // Remove user data from sessionStorage
    sessionStorage.removeItem("user")

    // Close menu
    handleClose()

    // Update login state
    setIsLoggedIn(false)

    // Navigate to home page
    navigate("/")
  }

  const handleLogin = () => {
    navigate("/login")
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  // Mobile menu button
  const mobileMenuButton = (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 1200,
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      <MenuIcon />
    </IconButton>
  )

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: 250,
        bgcolor: "background.paper",
      }}
    >
      {/* App Logo/Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10a37f, #0e8a6c)",
            mr: 1.5,
          }}
        >
          <DescriptionIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          MeetingFiles
        </Typography>
      </Box>

      {/* User Profile / Login Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isLoggedIn ? (
          <>
            <Box
              onClick={handleUserClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                width: "100%",
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#10a37f",
                }}
              >
                {user?.userName ? user.userName.charAt(0).toUpperCase() : <PersonIcon />}
              </Avatar>
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="body2" fontWeight={500} noWrap>
                  {user?.userName || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email || "Logged in"}
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Not logged in
            </Typography>
            <Button
              onClick={() => navigate("/login")}
              variant="outlined"
              startIcon={<LoginIcon />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderColor: "#10a37f",
                color: "#10a37f",
                "&:hover": {
                  borderColor: "#0e8a6c",
                  bgcolor: "rgba(16, 163, 127, 0.04)",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Box>

      {/* Main Navigation */}
      <List sx={{ flexGrow: 0, pt: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                "&.Mui-selected": {
                  bgcolor: "rgba(16, 163, 127, 0.08)",
                  color: "#10a37f",
                  "&:hover": {
                    bgcolor: "rgba(16, 163, 127, 0.12)",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#10a37f",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? "#10a37f" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Recent Files Section */}
      <Box sx={{ flexGrow: 1, overflow: "auto", px: 2, py: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            fontWeight: 500,
            px: 1,
            mb: 1,
          }}
        >
          Recent Files
        </Typography>

        {loadingFiles ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} sx={{ color: "#10a37f" }} />
          </Box>
        ) : recentFiles.length > 0 ? (
          <List dense disablePadding>
            {recentFiles.map((file, index) => (
              <ListItem key={`${file.meetingId}-${index}`} disablePadding>
                <Tooltip
                  title={`Meeting: ${meetings.find((m) => m.id === file.meetingId)?.name || ""}`}
                  placement="left"
                >
                  <ListItemButton
                    onClick={() => handleNavigation(file.path)}
                    sx={{
                      borderRadius: 1,
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 30 }}>{getFileIcon(file.fileType)}</ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      primaryTypographyProps={{
                        variant: "body2",
                        noWrap: true,
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        ) : isLoggedIn ? (
          <Box sx={{ textAlign: "center", py: 2, px: 1 }}>
            <Typography variant="body2" color="text.secondary">
              No recent files to display
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 2, px: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Sign in to see recent files
            </Typography>
          </Box>
        )}
      </Box>

      {/* Bottom Actions */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        {isLoggedIn ? (
          <>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => handleNavigation("/add-meeting")}
              sx={{
                bgcolor: "#10a37f",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                mb: 1,
                "&:hover": {
                  bgcolor: "#0e8a6c",
                },
              }}
            >
              New Meeting
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: "#ff5252",
                color: "#ff5252",
                textTransform: "none",
                fontWeight: 500,
                mt: 1,
                "&:hover": {
                  bgcolor: "rgba(255, 82, 82, 0.04)",
                  borderColor: "#ff3333",
                },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "#10a37f",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#0e8a6c",
              },
            }}
          >
            Sign In
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/settings")}
            sx={{
              borderRadius: 1,
              py: 0.75,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && mobileMenuButton}

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
          zIndex: 1300,
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 250,
          flexShrink: 0,
          position: "fixed",
          zIndex: 1100,
          height: "100%",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            borderRight: "1px solid",
            borderColor: "divider",
            position: "fixed",
            height: "100%",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default AppSidebar
