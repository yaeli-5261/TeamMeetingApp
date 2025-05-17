// "use client"

// import { Box, Typography, Grid, Paper, Button, useTheme } from "@mui/material"
// import { motion } from "framer-motion"
// import { useNavigate } from "react-router-dom"
// import { Add as AddIcon, CalendarMonth as CalendarIcon, Description as DescriptionIcon } from "@mui/icons-material"

// export default function HomePage() {
//   const theme = useTheme()
//   const navigate = useNavigate()

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         ml: { xs: 0, md: "250px" }, // מרווח שמאלי בגודל התפריט במסכים גדולים
//         transition: "margin 0.3s",
//         boxSizing: "border-box",
//         p: { xs: 2, md: 3 },
//         maxWidth: { xs: "100%", md: "calc(100% - 250px)" },
//       }}
//     >
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//         <Box sx={{ maxWidth: 1200, mx: "auto" }}>
//           <Box sx={{ mb: 4, textAlign: "center" }}>
//             <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
//               ברוכים הבאים למערכת ניהול הפגישות
//             </Typography>
//             <Typography variant="body1" color="text.secondary" paragraph>
//               נהל את הפגישות, התמלולים והקבצים של הצוות שלך במקום אחד
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => navigate("/add-meeting")}
//               sx={{
//                 mt: 2,
//                 bgcolor: "#10a37f",
//                 color: "white",
//                 textTransform: "none",
//                 fontWeight: 500,
//                 px: 3,
//                 py: 1,
//                 "&:hover": {
//                   bgcolor: "#0e8a6c",
//                 },
//               }}
//             >
//               צור פגישה חדשה
//             </Button>
//           </Box>

//           <Grid container spacing={3} sx={{ mt: 2 }}>
//             <Grid item xs={12} md={4}>
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//               >
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     borderRadius: 2,
//                     border: "1px solid",
//                     borderColor: "divider",
//                     height: "100%",
//                     minHeight: 200,
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: 40,
//                         height: 40,
//                         borderRadius: "50%",
//                         bgcolor: "primary.lighter",
//                         color: "primary.main",
//                         mr: 2,
//                       }}
//                     >
//                       <CalendarIcon />
//                     </Box>
//                     <Typography variant="h6" fontWeight="medium">
//                       פגישות קרובות
//                     </Typography>
//                   </Box>
//                   <Box sx={{ color: "text.secondary", fontSize: "0.875rem", flexGrow: 1 }}>
//                     <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
//                       פגישת תכנון אסטרטגי - מחר, 10:00
//                     </Box>
//                     <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
//                       פגישת צוות - יום רביעי, 9:30
//                     </Box>
//                     <Box sx={{ py: 1 }}>סקירת מוצר - יום שישי, 14:00</Box>
//                   </Box>
//                   <Button
//                     variant="text"
//                     onClick={() => navigate("/meetings")}
//                     sx={{
//                       alignSelf: "flex-start",
//                       mt: 2,
//                       color: "primary.main",
//                       textTransform: "none",
//                       fontWeight: 500,
//                       p: 0,
//                       "&:hover": {
//                         bgcolor: "transparent",
//                         textDecoration: "underline",
//                       },
//                     }}
//                   >
//                     צפה בכל הפגישות
//                   </Button>
//                 </Paper>
//               </motion.div>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     borderRadius: 2,
//                     border: "1px solid",
//                     borderColor: "divider",
//                     height: "100%",
//                     minHeight: 200,
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: 40,
//                         height: 40,
//                         borderRadius: "50%",
//                         bgcolor: "primary.lighter",
//                         color: "primary.main",
//                         mr: 2,
//                       }}
//                     >
//                       <DescriptionIcon />
//                     </Box>
//                     <Typography variant="h6" fontWeight="medium">
//                       קבצים אחרונים
//                     </Typography>
//                   </Box>
//                   <Box sx={{ color: "text.secondary", fontSize: "0.875rem", flexGrow: 1 }}>
//                     <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
//                       סיכום פגישת אסטרטגיה.pdf
//                     </Box>
//                     <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>מפת דרכים 2025.docx</Box>
//                     <Box sx={{ py: 1 }}>משוב צוות.md</Box>
//                   </Box>
//                   <Button
//                     variant="text"
//                     onClick={() => navigate("/files")}
//                     sx={{
//                       alignSelf: "flex-start",
//                       mt: 2,
//                       color: "primary.main",
//                       textTransform: "none",
//                       fontWeight: 500,
//                       p: 0,
//                       "&:hover": {
//                         bgcolor: "transparent",
//                         textDecoration: "underline",
//                       },
//                     }}
//                   >
//                     צפה בכל הקבצים
//                   </Button>
//                 </Paper>
//               </motion.div>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//               >
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     borderRadius: 2,
//                     border: "1px solid",
//                     borderColor: "divider",
//                     height: "100%",
//                     minHeight: 200,
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: 40,
//                         height: 40,
//                         borderRadius: "50%",
//                         bgcolor: "primary.lighter",
//                         color: "primary.main",
//                         mr: 2,
//                       }}
//                     >
//                       <DescriptionIcon />
//                     </Box>
//                     <Typography variant="h6" fontWeight="medium">
//                       פעילות צוות
//                     </Typography>
//                   </Box>
//                   <Box sx={{ color: "text.secondary", fontSize: "0.875rem", flexGrow: 1 }}>
//                     <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>שרה העלתה קובץ חדש</Box>
//                     <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>אלכס יצר פגישה חדשה</Box>
//                     <Box sx={{ py: 1 }}>ג'יימי הגיב על מפת הדרכים</Box>
//                   </Box>
//                   <Button
//                     variant="text"
//                     onClick={() => navigate("/team")}
//                     sx={{
//                       alignSelf: "flex-start",
//                       mt: 2,
//                       color: "primary.main",
//                       textTransform: "none",
//                       fontWeight: 500,
//                       p: 0,
//                       "&:hover": {
//                         bgcolor: "transparent",
//                         textDecoration: "underline",
//                       },
//                     }}
//                   >
//                     צפה בכל הפעילויות
//                   </Button>
//                 </Paper>
//               </motion.div>
//             </Grid>
//           </Grid>
//         </Box>
//       </motion.div>
//     </Box>
//   )
// }















"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Grid, Paper, Button, useTheme, Skeleton, Tooltip } from "@mui/material"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Description as DescriptionIcon,
  Group as TeamIcon,
  PictureAsPdf as PdfIcon,
  Article as DocIcon,
  Image as ImageIcon,
  TextSnippet as TextIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../store/store"
import { fetchMeetingsByTeam } from "../../store/meetingSlice"

// Interface for recent file
interface RecentFile {
  name: string
  path: string
  meetingId: number
  fileType: string
  date: Date
}

// Interface for team activity
interface TeamActivity {
  id: number
  type: "file_upload" | "meeting_created" | "meeting_updated"
  description: string
  date: Date
  meetingId: number
  meetingName: string
}

export default function HomePage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState(true)
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])
  const [teamActivities, setTeamActivities] = useState<TeamActivity[]>([])

  const { user } = useSelector((state: RootState) => state.Auth)
  const meetings = useSelector((state: RootState) => state.meetings.list)

  // Fetch meetings data
  useEffect(() => {
    if (user?.teamId) {
      setLoading(true)

      if (meetings.length === 0) {
        dispatch(fetchMeetingsByTeam({ teamId: user.teamId }))
          .unwrap()
          .then((fetchedMeetings) => {
            processData(fetchedMeetings)
          })
          .catch((error) => {
            console.error("Error fetching meetings:", error)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        processData(meetings)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [user, meetings.length, dispatch])

  // Process meetings data to extract upcoming meetings, recent files, and team activities
  const processData = (meetingsData: any[]) => {
    // Get upcoming meetings (future meetings sorted by closest date)
    const now = new Date()
    const upcoming = [...meetingsData]
      .filter((meeting) => new Date(meeting.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)

    setUpcomingMeetings(upcoming)

    // Get recent files
    const files: RecentFile[] = []

    meetingsData.forEach((meeting) => {
      // Check for original file
      if (meeting.linkOrinignFile) {
        const fileName = meeting.linkOrinignFile.split("/").pop() || "קובץ"
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
        const fileName = meeting.linkTranscriptFile.split("/").pop() || "תמלול"
        const fileType = getFileType(fileName)

        files.push({
          name: `תמלול - ${fileName}`,
          path: `/meeting-details/${meeting.id}`,
          meetingId: meeting.id,
          fileType: fileType,
          date: new Date(meeting.date),
        })
      }
    })

    // Sort by date (newest first) and take the first 3
    const sortedFiles = files.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3)
    setRecentFiles(sortedFiles)

    // Generate team activities based on meetings and files
    const activities: TeamActivity[] = []

    // Add meeting creation activities
    meetingsData.forEach((meeting) => {
      activities.push({
        id: meeting.id * 100,
        type: "meeting_created",
        description: `נוצרה פגישה חדשה: ${meeting.name}`,
        date: new Date(meeting.date),
        meetingId: meeting.id,
        meetingName: meeting.name,
      })

      // Add file upload activities if files exist
      if (meeting.linkOrinignFile) {
        const fileName = meeting.linkOrinignFile.split("/").pop() || "קובץ"
        activities.push({
          id: meeting.id * 100 + 1,
          type: "file_upload",
          description: `הועלה קובץ חדש: ${fileName}`,
          date: new Date(meeting.date),
          meetingId: meeting.id,
          meetingName: meeting.name,
        })
      }

      if (meeting.linkTranscriptFile) {
        const fileName = meeting.linkTranscriptFile.split("/").pop() || "תמלול"
        activities.push({
          id: meeting.id * 100 + 2,
          type: "file_upload",
          description: `הועלה קובץ תמלול: ${fileName}`,
          date: new Date(meeting.date),
          meetingId: meeting.id,
          meetingName: meeting.name,
        })
      }
    })

    // Sort by date (newest first) and take the first 3
    const sortedActivities = activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3)
    setTeamActivities(sortedActivities)
  }

  // Get file type based on extension
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

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Check if date is today
      if (date.toDateString() === now.toDateString()) {
        return `היום, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
      }

      // Check if date is tomorrow
      if (date.toDateString() === tomorrow.toDateString()) {
        return `מחר, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
      }

      // Otherwise use full date format
      return new Intl.DateTimeFormat("he-IL", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return String(dateString)
    }
  }

  // Get relative time for activity
  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `לפני ${diffMins} דקות`
    } else if (diffHours < 24) {
      return `לפני ${diffHours} שעות`
    } else {
      return `לפני ${diffDays} ימים`
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        ml: { xs: 0, md: "250px" }, // מרווח שמאלי בגודל התפריט במסכים גדולים
        transition: "margin 0.3s",
        boxSizing: "border-box",
        p: { xs: 2, md: 3 },
        maxWidth: { xs: "100%", md: "calc(100% - 250px)" },
      }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              ברוכים הבאים למערכת ניהול הפגישות
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              נהל את הפגישות, התמלולים והקבצים של הצוות שלך במקום אחד
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/add-meeting")}
              sx={{
                mt: 2,
                bgcolor: "#10a37f",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                "&:hover": {
                  bgcolor: "#0e8a6c",
                },
              }}
            >
              צור פגישה חדשה
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Upcoming Meetings */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%",
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.lighter",
                        color: "primary.main",
                        mr: 2,
                      }}
                    >
                      <CalendarIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="medium">
                      פגישות קרובות
                    </Typography>
                  </Box>

                  <Box sx={{ color: "text.secondary", fontSize: "0.875rem", flexGrow: 1 }}>
                    {loading ? (
                      // Loading skeleton
                      Array.from(new Array(3)).map((_, index) => (
                        <Box
                          key={index}
                          sx={{ py: 1, borderBottom: index < 2 ? "1px solid" : "none", borderColor: "divider" }}
                        >
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="40%" />
                        </Box>
                      ))
                    ) : upcomingMeetings.length > 0 ? (
                      // Upcoming meetings list
                      upcomingMeetings.map((meeting, index) => (
                        <Box
                          key={meeting.id}
                          sx={{
                            py: 1,
                            borderBottom: index < upcomingMeetings.length - 1 ? "1px solid" : "none",
                            borderColor: "divider",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.02)",
                            },
                          }}
                          onClick={() => navigate(`/meeting-details/${meeting.id}`)}
                        >
                          <Typography variant="body2" fontWeight={500} color="text.primary">
                            {meeting.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(meeting.date)}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      // No meetings message
                      <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          אין פגישות קרובות
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Button
                    variant="text"
                    onClick={() => navigate("/meetings")}
                    sx={{
                      alignSelf: "flex-start",
                      mt: 2,
                      color: "primary.main",
                      textTransform: "none",
                      fontWeight: 500,
                      p: 0,
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    צפה בכל הפגישות
                  </Button>
                </Paper>
              </motion.div>
            </Grid>

            {/* Recent Files */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%",
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.lighter",
                        color: "primary.main",
                        mr: 2,
                      }}
                    >
                      <DescriptionIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="medium">
                      קבצים אחרונים
                    </Typography>
                  </Box>

                  <Box sx={{ color: "text.secondary", fontSize: "0.875rem", flexGrow: 1 }}>
                    {loading ? (
                      // Loading skeleton
                      Array.from(new Array(3)).map((_, index) => (
                        <Box
                          key={index}
                          sx={{ py: 1, borderBottom: index < 2 ? "1px solid" : "none", borderColor: "divider" }}
                        >
                          <Skeleton variant="text" width="80%" />
                        </Box>
                      ))
                    ) : recentFiles.length > 0 ? (
                      // Recent files list
                      recentFiles.map((file, index) => (
                        <Tooltip
                          key={`${file.meetingId}-${index}`}
                          title={`פגישה: ${meetings.find((m) => m.id === file.meetingId)?.name || ""}`}
                        >
                          <Box
                            sx={{
                              py: 1,
                              borderBottom: index < recentFiles.length - 1 ? "1px solid" : "none",
                              borderColor: "divider",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "rgba(0, 0, 0, 0.02)",
                              },
                            }}
                            onClick={() => navigate(file.path)}
                          >
                            {getFileIcon(file.fileType)}
                            <Typography variant="body2">{file.name}</Typography>
                          </Box>
                        </Tooltip>
                      ))
                    ) : (
                      // No files message
                      <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          אין קבצים אחרונים
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Button
                    variant="text"
                    onClick={() => navigate("/meetings")}
                    sx={{
                      alignSelf: "flex-start",
                      mt: 2,
                      color: "primary.main",
                      textTransform: "none",
                      fontWeight: 500,
                      p: 0,
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    צפה בכל הקבצים
                  </Button>
                </Paper>
              </motion.div>
            </Grid>

            {/* Team Activity */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%",
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.lighter",
                        color: "primary.main",
                        mr: 2,
                      }}
                    >
                      <TeamIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="medium">
                      פעילות צוות
                    </Typography>
                  </Box>

                  <Box sx={{ color: "text.secondary", fontSize: "0.875rem", flexGrow: 1 }}>
                    {loading ? (
                      // Loading skeleton
                      Array.from(new Array(3)).map((_, index) => (
                        <Box
                          key={index}
                          sx={{ py: 1, borderBottom: index < 2 ? "1px solid" : "none", borderColor: "divider" }}
                        >
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="30%" />
                        </Box>
                      ))
                    ) : teamActivities.length > 0 ? (
                      // Team activities list
                      teamActivities.map((activity, index) => (
                        <Box
                          key={activity.id}
                          sx={{
                            py: 1,
                            borderBottom: index < teamActivities.length - 1 ? "1px solid" : "none",
                            borderColor: "divider",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.02)",
                            },
                          }}
                          onClick={() => navigate(`/meeting-details/${activity.meetingId}`)}
                        >
                          <Typography variant="body2">{activity.description}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getRelativeTime(activity.date)}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      // No activities message
                      <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          אין פעילויות אחרונות
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Button
                    variant="text"
                    onClick={() => navigate("/meetings")}
                    sx={{
                      alignSelf: "flex-start",
                      mt: 2,
                      color: "primary.main",
                      textTransform: "none",
                      fontWeight: 500,
                      p: 0,
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    צפה בכל הפעילויות
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  )
}

