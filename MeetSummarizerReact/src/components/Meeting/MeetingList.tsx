"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Typography,
  Button,
  Box,
  Avatar,
  Paper,
  Divider,
  Chip,
  IconButton,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SortIcon from "@mui/icons-material/Sort"
import FilterListIcon from "@mui/icons-material/FilterList"
import UpdateMeetingDialog from "./UpdateMeetingDialog"
import type { MeetingDTO } from "../../models/meetingTypes"
import { fetchMeetingsByTeam, deleteMeeting } from "../../store/meetingSlice"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../store/store"
import MeetingSearch from "./MeetingSearch "

interface MeetingListProps {
  meetings?: MeetingDTO[]
}

export default function MeetingList({ meetings: meetingsFromProps }: MeetingListProps) {
  const [meetings, setMeetings] = useState<MeetingDTO[]>(meetingsFromProps || [])
  const [loading, setLoading] = useState(!meetingsFromProps)
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [activeMeetingId, setActiveMeetingId] = useState<number | null>(null)
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [sortBy, setSortBy] = useState<"date" | "name">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.Auth.user)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    if (!meetingsFromProps) {
      const getMeetings = async () => {
        setLoading(true)
        try {
          const response = user?.teamId ? await fetchMeetingsByTeam({ teamId: user.teamId }) : []
          if (Array.isArray(response)) {
            setMeetings(response)
          }
        } catch (error) {
          console.error("Error fetching meetings:", error)
        } finally {
          setLoading(false)
        }
      }
      getMeetings()
    }
  }, [meetingsFromProps, user])

  const handleUpdate = (updatedMeeting: MeetingDTO) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) => (meeting.id === updatedMeeting.id ? updatedMeeting : meeting)),
    )
  }

  // פונקציית חיפוש
  const filteredMeetings = meetings.filter((meeting) => meeting.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // מיון פגישות
  const sortedMeetings = [...filteredMeetings].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    } else {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }
  })

  // פונקציה לפורמט תאריך
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("he-IL", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString // אם יש בעיה בפורמט, החזר את המחרוזת המקורית
    }
  }

  // פונקציות לתפריטים
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, meetingId: number) => {
    setMenuAnchorEl(event.currentTarget)
    setActiveMeetingId(meetingId)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setActiveMeetingId(null)
  }

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchorEl(event.currentTarget)
  }

  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null)
  }

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchorEl(event.currentTarget)
  }

  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null)
  }

  const handleSort = (field: "date" | "name") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("desc")
    }
    handleSortMenuClose()
  }

  const handleEditMeeting = (meeting: MeetingDTO) => {
    setSelectedMeeting(meeting)
    handleMenuClose()
  }

  // פונקציות למחיקת פגישה
  const handleDeleteClick = (meetingId: number) => {
    setMeetingToDelete(meetingId)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setMeetingToDelete(null)
  }

  const handleDeleteConfirm = async () => {
    if (meetingToDelete) {
      try {
        await dispatch(deleteMeeting(meetingToDelete)).unwrap()
        setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== meetingToDelete))
        setSnackbarMessage("הפגישה נמחקה בהצלחה")
        setSnackbarOpen(true)
      } catch (error) {
        console.error("Error deleting meeting:", error)
        setSnackbarMessage("שגיאה במחיקת הפגישה")
        setSnackbarOpen(true)
      }
      setDeleteDialogOpen(false)
      setMeetingToDelete(null)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          mb: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600} color="text.primary">
            פגישות
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={handleFilterMenuOpen}
              sx={{
                borderColor: "divider",
                color: "text.secondary",
                textTransform: "none",
              }}
            >
              סינון
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SortIcon />}
              onClick={handleSortMenuOpen}
              sx={{
                borderColor: "divider",
                color: "text.secondary",
                textTransform: "none",
              }}
            >
              מיון
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/add-meeting")}
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
              פגישה חדשה
            </Button>
          </Box>
        </Box>

        {/* תפריט מיון */}
        <Menu
          anchorEl={sortMenuAnchorEl}
          open={Boolean(sortMenuAnchorEl)}
          onClose={handleSortMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => handleSort("date")} selected={sortBy === "date"}>
            <ListItemIcon>
              <CalendarTodayIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">
              לפי תאריך {sortBy === "date" && (sortDirection === "asc" ? "(מהישן לחדש)" : "(מהחדש לישן)")}
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleSort("name")} selected={sortBy === "name"}>
            <ListItemIcon>
              <SortIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">
              לפי שם {sortBy === "name" && (sortDirection === "asc" ? "(א-ת)" : "(ת-א)")}
            </Typography>
          </MenuItem>
        </Menu>

        {/* תפריט סינון */}
        <Menu
          anchorEl={filterMenuAnchorEl}
          open={Boolean(filterMenuAnchorEl)}
          onClose={handleFilterMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleFilterMenuClose}>
            <Typography variant="body2">כל הפגישות</Typography>
          </MenuItem>
          <MenuItem onClick={handleFilterMenuClose}>
            <Typography variant="body2">פגישות עם תמלול</Typography>
          </MenuItem>
          <MenuItem onClick={handleFilterMenuClose}>
            <Typography variant="body2">פגישות ללא תמלול</Typography>
          </MenuItem>
        </Menu>

        {/* מנוע החיפוש */}
        <Box sx={{ mb: 3 }}>
          <MeetingSearch onSearch={setSearchQuery} />
        </Box>

        {/* רשימת פגישות */}
        {loading ? (
          // סקלטון לטעינה
          Array.from(new Array(3)).map((_, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width={200} height={30} />
              </Box>
              <Skeleton variant="text" width="60%" />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rectangular" width={100} height={36} />
              </Box>
            </Paper>
          ))
        ) : sortedMeetings.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {sortedMeetings.map((meeting) => (
              <motion.div
                key={meeting.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 0,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: "#10a37f",
                            width: 40,
                            height: 40,
                            mr: 2,
                          }}
                        >
                          {meeting.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          {meeting.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, meeting.id)}
                        aria-label="אפשרויות נוספות"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mt: 2, color: "text.secondary" }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">{formatDate(meeting.date)}</Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      bgcolor: "rgba(0,0,0,0.01)",
                    }}
                  >
                    <Box>
                      {meeting.linkTranscriptFile && (
                        <Chip
                          label="תמלול זמין"
                          size="small"
                          sx={{
                            bgcolor: "#10a37f20",
                            color: "#10a37f",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/meeting-details/${meeting.id}`)}
                      sx={{
                        color: "#10a37f",
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      הצג פרטים
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary",
            }}
          >
            <Typography variant="body1" gutterBottom>
              לא נמצאו פגישות בשם זה.
            </Typography>
            <Typography variant="body2">נסה לחפש מחדש או צור פגישה חדשה.</Typography>
          </Box>
        )}
      </Paper>

      {/* תפריט אפשרויות לפגישה */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            const meeting = meetings.find((m) => m.id === activeMeetingId)
            if (meeting) handleEditMeeting(meeting)
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">ערוך פגישה</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeMeetingId) handleDeleteClick(activeMeetingId)
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" color="error.main">
            מחק פגישה
          </Typography>
        </MenuItem>
      </Menu>

      {/* דיאלוג אישור מחיקה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "error.main" }}>
          {"האם אתה בטוח שברצונך למחוק את הפגישה?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="alert-dialog-description">
            פעולה זו אינה ניתנת לביטול. כל הנתונים הקשורים לפגישה זו יימחקו לצמיתות.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            ביטול
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" autoFocus startIcon={<DeleteIcon />}>
            מחק פגישה
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג עדכון פגישה */}
      {selectedMeeting && (
        <UpdateMeetingDialog
          open={Boolean(selectedMeeting)}
          handleClose={() => setSelectedMeeting(null)}
          meeting={selectedMeeting}
          onUpdate={handleUpdate}
        />
      )}

      {/* הודעת Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("שגיאה") ? "error" : "success"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

