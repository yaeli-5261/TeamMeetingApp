// // import { Button } from "@/components/ui/button"
// import Button from "@mui/material/Button";
// import { Calendar, FileText, FolderOpen, Home, MessageSquare, PlusCircle, Settings, Users } from "lucide-react"
// import { Link } from "react-router-dom";
// // import Link from "next/link";
// export function AppSidebar() {
//   return (
//     <div className="flex h-screen w-64 flex-col border-r bg-background">
//       <div className="flex h-14 items-center border-b px-4">
//         <Link to="/" className="flex items-center gap-2 font-semibold">
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-teal-400">
//             <FileText className="h-4 w-4 text-white" />
//           </div>
//           <span>MeetingFiles</span>
//         </Link>
//       </div>
//       <div className="flex-1 overflow-auto p-3">
//         <div className="space-y-1">
//           <Button variant="ghost" className="w-full justify-start gap-3" asChild>
//             <Link to ="/">
//               <Home className="h-4 w-4" />
//               Dashboard
//             </Link>
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-3" asChild>
//             <Link to ="/meetings">
//               <MessageSquare className="h-4 w-4" />
//               Meetings
//             </Link>
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-3" asChild>
//             <Link to ="/calendar">
//               <Calendar className="h-4 w-4" />
//               Calendar
//             </Link>
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-3" asChild>
//             <Link to ="/files">
//               <FolderOpen className="h-4 w-4" />
//               Files
//             </Link>
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-3" asChild>
//             <Link to ="/team">
//               <Users className="h-4 w-4" />
//               Team
//             </Link>
//           </Button>
//         </div>

//         <div className="mt-6">
//           <div className="text-xs font-medium text-muted-foreground mb-2 px-3">Recent Files</div>
//           <div className="space-y-1">
//             <Button variant="ghost" size="sm" className="w-full justify-start text-xs font-normal">
//               Q1 Strategy Meeting.pdf
//             </Button>
//             <Button variant="ghost" size="sm" className="w-full justify-start text-xs font-normal">
//               Product Roadmap 2025.docx
//             </Button>
//             <Button variant="ghost" size="sm" className="w-full justify-start text-xs font-normal">
//               Team Feedback Notes.md
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="border-t p-3">
//         <Button className="w-full gap-2" size="sm">
//           <PlusCircle className="h-4 w-4" />
//           New Meeting
//         </Button>
//         <Button variant="ghost" className="mt-2 w-full justify-start gap-3" asChild>
//           <Link href="/settings">
//             <Settings className="h-4 w-4" />
//             Settings
//           </Link>
//         </Button>
//       </div>
//     </div>
//   )
// }

import { Button, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';

export function AppSidebar() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: 250, 
      height: '100vh',
      borderRight: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        height: 56, 
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #14b8a6)'
          }}>
            <DescriptionIcon sx={{ color: 'white', fontSize: 16 }} />
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>
            MeetingFiles
          </Typography>
        </Link>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ p: 1.5, overflowY: 'auto', flexGrow: 1 }}>

        <List disablePadding>
          <ListItem disablePadding>
            <Button
              component={Link}
              to="/"
              variant="text"
              fullWidth
              sx={{ 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </Button>
          </ListItem>

          <ListItem disablePadding>
            <Button
              component={Link}
              to="/meetings"
              variant="text"
              fullWidth
              sx={{ 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ChatIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Meetings" />
            </Button>
          </ListItem>

          <ListItem disablePadding>
            <Button
              component={Link}
              to="/"
              variant="text"
              fullWidth
              sx={{ 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </Button>
          </ListItem>

          <ListItem disablePadding>
            <Button
              component={Link}
              to="/signIn"
              variant="text"
              fullWidth
              sx={{ 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ChatIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </Button>
          </ListItem>

          <ListItem disablePadding>
            <Button
              component={Link}
              to="/"
              variant="text"
              fullWidth
              sx={{ 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CalendarMonthIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </Button>
          </ListItem>

          <ListItem disablePadding>
            <Button
              component={Link}
              to="/"
              variant="text"
              fullWidth
              sx={{ 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FolderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Files" />
            </Button>
          </ListItem>

          <ListItem disablePadding>
            <Button
              component={Link}
              to="/"
              variant="text"
              fullWidth
              sx={{ 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                py: 1,
                px: 2,
                borderRadius: 1,
                mb: 0.5,
                color: 'text.primary'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Team" />
            </Button>
          </ListItem>
        </List>

        {/* Recent Files */}
        <Box sx={{ mt: 3 }}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ px: 2, fontWeight: 500 }}
          >
            Recent Files
          </Typography>
          
          <List dense disablePadding sx={{ mt: 0.5 }}>
            <ListItem disablePadding>
              <Button
                variant="text"
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start', 
                  textAlign: 'left',
                  py: 0.5,
                  px: 2,
                  borderRadius: 1,
                  mb: 0.5,
                  fontSize: '0.75rem',
                  color: 'text.primary'
                }}
              >
                Q1 Strategy Meeting.pdf
              </Button>
            </ListItem>
            
            <ListItem disablePadding>
              <Button
                variant="text"
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start', 
                  textAlign: 'left',
                  py: 0.5,
                  px: 2,
                  borderRadius: 1,
                  mb: 0.5,
                  fontSize: '0.75rem',
                  color: 'text.primary'
                }}
              >
                Product Roadmap 2025.docx
              </Button>
            </ListItem>
            
            <ListItem disablePadding>
              <Button
                variant="text"
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start', 
                  textAlign: 'left',
                  py: 0.5,
                  px: 2,
                  borderRadius: 1,
                  mb: 0.5,
                  fontSize: '0.75rem',
                  color: 'text.primary'
                }}
              >
                Team Feedback Notes.md
              </Button>
            </ListItem>
          </List>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          component={Link}
          to="/add-meeting"
          variant="contained"
          fullWidth
          startIcon={<AddCircleIcon />}
          sx={{ 
            bgcolor: '#1a1a1a',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#2c2c2c'
            }
          }}
        >
          New Meeting
        </Button>
        
        <Button
          component={Link}
          to="/"
          variant="text"
          fullWidth
          sx={{ 
            justifyContent: 'flex-start', 
            textAlign: 'left',
            py: 1,
            px: 2,
            mt: 1,
            borderRadius: 1,
            color: 'text.primary'
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </Button>
      </Box>
    </Box>
  );
}