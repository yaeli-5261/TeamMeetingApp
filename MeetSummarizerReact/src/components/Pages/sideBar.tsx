"use client"

import { useState } from "react"
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
} from "@mui/material"
import {
  Home as HomeIcon,
  Message as MessageIcon,
  CalendarMonth as CalendarIcon,
  Folder as FolderIcon,
  Group as TeamIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import FileTextIcon from "@mui/icons-material/Description"

// Define the navigation items
const navItems = [
  { name: "Dashboard", path: "/", icon: <HomeIcon /> },
  { name: "Meetings", path: "/meetings", icon: <MessageIcon /> },
  { name: "Calendar", path: "/calendar", icon: <CalendarIcon /> },
  { name: "Files", path: "/files", icon: <FolderIcon /> },
  { name: "Team", path: "/team", icon: <TeamIcon /> },
]

// Recent files data
const recentFiles = [
  { name: "Q1 Strategy Meeting.pdf", path: "/files/q1-strategy" },
  { name: "Product Roadmap 2025.docx", path: "/files/product-roadmap" },
  { name: "Team Feedback Notes.md", path: "/files/team-feedback" },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

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
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            mr: 1.5,
          }}
        >
          <FileTextIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          MeetingFiles
        </Typography>
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
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.08)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
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
        <List dense disablePadding>
          {recentFiles.map((file) => (
            <ListItem key={file.name} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(file.path)}
                sx={{
                  borderRadius: 1,
                  py: 0.5,
                  px: 1,
                }}
              >
                <ListItemText
                  primary={file.name}
                  primaryTypographyProps={{
                    variant: "body2",
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Actions */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => handleNavigation("/add-meeting")}
          sx={{
            bgcolor: "#1a1a1a",
            color: "white",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#2c2c2c",
            },
          }}
        >
          New Meeting
        </Button>
        <ListItem disablePadding sx={{ mt: 1 }}>
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
      {/* Mobile drawer */}
      {isMobile && (
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
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

