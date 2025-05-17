"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogContent,
  Paper,
  Divider,
  Chip,
  Grid,
  Avatar,
  Skeleton,
  Alert,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarTodayIcon,
  Link as LinkIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import UpdateMeetingDialog from "./UpdateMeetingDialog"
import axios from "axios"
import type { MeetingDTO } from "../../models/meetingTypes"
import { fetchMeetingById } from "../../services/meetingService"
import FileUploader from "../File/FileUploader"
import FileViewer from "../File/FileViewer"

export default function MeetingDetails() {
  const { meetingId } = useParams<{ meetingId: string }>()
  const [meeting, setMeeting] = useState<MeetingDTO | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const getMeeting = async () => {
      try {
        setLoading(true)
        const data = await fetchMeetingById(Number(meetingId))
        setMeeting(data)
      } catch (err) {
        console.error("Error fetching meeting:", err)
        setError("שגיאה בטעינת פרטי הפגישה")
      } finally {
        setLoading(false)
      }
    }
    getMeeting()
  }, [meetingId])

  const handleUpdate = (updatedMeeting: MeetingDTO) => {
    setMeeting(updatedMeeting)
  }

  const fetchFileContent = async (fileUrl: string) => {
    try {
      // Get download URL from file path
      const response = await axios.get("https://localhost:7214/api/upload/download-url", {
        params: { fileName: fileUrl },
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      const downloadUrl = response.data.downloadUrl

      // Fetch file content
      const fileResponse = await axios.get(downloadUrl, { responseType: "text" })
      setFileContent(fileResponse.data)
      setIsFileDialogOpen(true)
    } catch (error) {
      console.error("❌ שגיאה בטעינת תוכן הקובץ:", error)
      setFileContent("⚠️ שגיאה בטעינת הקובץ")
      setIsFileDialogOpen(true)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Helper function to get file name from path
  const getFileName = (filePath: string) => {
    if (!filePath) return ""
    return filePath.split("/").pop() || "קובץ"
  }

  // Helper function to get cookie value
  function getCookie(name: string): string | null {
    const cookies = document.cookie.split("; ")
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=")
      if (key === name) {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/meetings")} sx={{ mr: 2 }} aria-label="חזרה לרשימת הפגישות">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={600}>
            פרטי פגישה
          </Typography>
        </Box>

        {loading ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
              <Skeleton variant="text" width={200} height={40} />
            </Box>
            <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          </Paper>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : meeting ? (
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 50,
                      height: 50,
                      mr: 2,
                    }}
                  >
                    {meeting.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" fontWeight={600}>
                    {meeting.name}
                  </Typography>
                </Box>
                <Tooltip title="ערוך פגישה">
                  <IconButton
                    color="primary"
                    onClick={() => setSelectedMeeting(meeting)}
                    size="small"
                    sx={{
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.08)",
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      תאריך ושעה
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(meeting.date)}
                      </Typography>
                    </Box>
                  </Box>

                  {meeting.linkOrinignFile && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        קובץ מקור
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <DescriptionIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body1" fontWeight={500}>
                          {getFileName(meeting.linkOrinignFile)}
                        </Typography>
                      </Box>

                      <FileViewer filePath={meeting.linkOrinignFile} fileName={getFileName(meeting.linkOrinignFile)} />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {meeting.linkTranscriptFile ? (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        קובץ תמלול
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <LinkIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body1" fontWeight={500}>
                          {getFileName(meeting.linkTranscriptFile)}
                        </Typography>
                      </Box>

                      <FileViewer
                        filePath={meeting.linkTranscriptFile}
                        fileName={getFileName(meeting.linkTranscriptFile)}
                        isAiGenerated={true}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        קובץ תמלול
                      </Typography>
                      <Chip
                        label="אין קובץ תמלול"
                        size="small"
                        sx={{
                          bgcolor: "warning.lighter",
                          color: "warning.dark",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box sx={{ p: 3, bgcolor: "rgba(0, 0, 0, 0.01)" }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                העלאת קבצים
              </Typography>
              <FileUploader />
            </Box>
          </Paper>
        ) : (
          <Alert severity="warning">לא נמצאה פגישה עם המזהה המבוקש</Alert>
        )}
      </motion.div>

      <Dialog
        fullScreen={isMobile}
        maxWidth="md"
        open={isFileDialogOpen}
        onClose={() => setIsFileDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: isMobile ? "100%" : "80vh",
          },
        }}
      >
        <DialogContent sx={{ p: 3, bgcolor: "#f9f9f9" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              תוכן הקובץ
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setIsFileDialogOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              maxHeight: "calc(80vh - 120px)",
              overflow: "auto",
            }}
          >
            <Typography
              variant="body1"
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {fileContent}
            </Typography>
          </Paper>
        </DialogContent>
      </Dialog>

      {selectedMeeting && (
        <UpdateMeetingDialog
          open={Boolean(selectedMeeting)}
          handleClose={() => setSelectedMeeting(null)}
          meeting={selectedMeeting}
          onUpdate={handleUpdate}
        />
      )}
    </Box>
  )
}
