// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { PlusCircle } from "lucide-react";
// import { Card, CardContent, Typography, Button, Container, Box, Avatar, TextField } from "@mui/material";
// import UpdateMeetingDialog from "./UpdateMeetingDialog";
// import { MeetingDTO } from "../../models/meetingTypes";
// import { fetchMeetingsByTeam } from "../../store/meetingSlice";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import MeetingSearch from "./MeetingSearch ";

// interface MeetingListProps {
//   meetings?: MeetingDTO[];
// }

// export default function MeetingList({ meetings: meetingsFromProps }: MeetingListProps) {
//   const [meetings, setMeetings] = useState<MeetingDTO[]>(meetingsFromProps || []);
//   const [loading, setLoading] = useState(!meetingsFromProps);
//   const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null);
//   const [searchQuery, setSearchQuery] = useState(""); // הוספת state לחיפוש
//   const navigate = useNavigate();
//   const user = useSelector((state: RootState) => state.Auth.user);

//   useEffect(() => {
//     if (!meetingsFromProps) {
//       const getMeetings = async () => {
//         setLoading(true);
//         const response = user.teamId ? fetchMeetingsByTeam({ teamId: user.teamId }) : [];
//         setLoading(false);
//       };
//       getMeetings();
//     }
//   }, [meetingsFromProps]);

//   const handleUpdate = (updatedMeeting: MeetingDTO) => {
//     setMeetings((prevMeetings) =>
//       prevMeetings.map((meeting) => (meeting.id === updatedMeeting.id ? updatedMeeting : meeting))
//     );
//   };

//   // פונקציית חיפוש
//   const filteredMeetings = meetings.filter((meeting) =>
//     meeting.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Container maxWidth="md" sx={{ py: 5, bgcolor: "#f9f9f9", borderRadius: 3, boxShadow: 3 }}>
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//         <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="#37474F">
//           📅 רשימת פגישות
//         </Typography>

//         <Box display="flex" justifyContent="center" mb={3}>
//           <Button
//             variant="contained"
//             sx={{
//               bgcolor: "#5C6BC0",
//               color: "white",
//               '&:hover': { bgcolor: "#3F51B5" },
//               fontWeight: "bold",
//             }}
//             startIcon={<PlusCircle size={24} />}
//             onClick={() => navigate("/add-meeting")}
//           >
//             הוספת פגישה חדשה
//           </Button>
//         </Box>

//         {/* מנוע החיפוש */}
//         <MeetingSearch onSearch={setSearchQuery} />

//         {loading ? (
//           <Typography textAlign="center" color="gray">טוען...</Typography>
//         ) : filteredMeetings.length > 0 ? (
//           <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}>
//             {filteredMeetings.map((meeting) => (
//               <motion.div key={meeting.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//                 <Card sx={{ mb: 2, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
//                   <CardContent>
//                     <Box display="flex" alignItems="center" mb={2}>
//                       <Avatar sx={{ bgcolor: "#5C6BC0", mr: 2 }}>{meeting.name.charAt(0)}</Avatar>
//                       <Typography variant="h6" fontWeight="bold" color="#263238">{meeting.name}</Typography>
//                     </Box>
//                     <Typography color="textSecondary" gutterBottom>📅 <strong>תאריך:</strong> {meeting.date}</Typography>
                   
//                       <Button
//                         variant="contained"
//                         sx={{
//                           bgcolor: "#4CAF50",
//                           color: "white",
//                           '&:hover': { bgcolor: "#388E3C" },
//                           fontWeight: "bold",
//                         }}
//                         onClick={() => navigate(`/meeting-details/${meeting.id}`)}
//                       >
//                         הצג פרטים
//                       </Button>
//                       </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <Typography textAlign="center" color="gray">לא נמצאו פגישות בשם זה.</Typography>
//         )}
//       </motion.div>

//       {selectedMeeting && (
//         <UpdateMeetingDialog open={Boolean(selectedMeeting)} handleClose={() => setSelectedMeeting(null)} meeting={selectedMeeting} onUpdate={handleUpdate} />
//       )}
//     </Container>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Avatar, 
  Paper,
  Divider,
  Chip,
  Grid,
  IconButton,
  Skeleton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateMeetingDialog from "./UpdateMeetingDialog";
import { MeetingDTO } from "../../models/meetingTypes";
import { fetchMeetingsByTeam } from "../../store/meetingSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import MeetingSearch from "./MeetingSearch ";
// import MeetingSearch from "./MeetingSearch";

interface MeetingListProps {
  meetings?: MeetingDTO[];
}

export default function MeetingList({ meetings: meetingsFromProps }: MeetingListProps) {
  const [meetings, setMeetings] = useState<MeetingDTO[]>(meetingsFromProps || []);
  const [loading, setLoading] = useState(!meetingsFromProps);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.Auth.user);

  useEffect(() => {
    if (!meetingsFromProps) {
      const getMeetings = async () => {
        setLoading(true);
        try {
          // בהנחה שהפונקציה מחזירה Promise עם נתונים
          const response = user?.teamId ? await fetchMeetingsByTeam({ teamId: user.teamId }) : [];
          if (Array.isArray(response)) {
            setMeetings(response);
          }
        } catch (error) {
          console.error("Error fetching meetings:", error);
        } finally {
          setLoading(false);
        }
      };
      getMeetings();
    }
  }, [meetingsFromProps, user]);

  const handleUpdate = (updatedMeeting: MeetingDTO) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) => (meeting.id === updatedMeeting.id ? updatedMeeting : meeting))
    );
  };

  // פונקציית חיפוש
  const filteredMeetings = meetings.filter((meeting) =>
    meeting.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // פונקציה לפורמט תאריך
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('he-IL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString; // אם יש בעיה בפורמט, החזר את המחרוזת המקורית
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            פגישות
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/add-meeting")}
            sx={{ 
              bgcolor: '#1a1a1a',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#2c2c2c'
              }
            }}
          >
            פגישה חדשה
          </Button>
        </Box>

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
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width={200} height={30} />
              </Box>
              <Skeleton variant="text" width="60%" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rectangular" width={100} height={36} />
              </Box>
            </Paper>
          ))
        ) : filteredMeetings.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.4 }}
          >
            {filteredMeetings.map((meeting) => (
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
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                            mr: 2
                          }}
                        >
                          {meeting.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          {meeting.name}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'text.secondary' }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {formatDate(meeting.date)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    bgcolor: 'rgba(0,0,0,0.01)'
                  }}>
                    <Box>
                      {meeting.linkTranscriptFile && (
                        <Chip 
                          label="תמלול זמין" 
                          size="small" 
                          sx={{ 
                            bgcolor: 'success.light', 
                            color: 'success.contrastText',
                            fontSize: '0.75rem'
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
                        color: 'primary.main',
                        textTransform: 'none',
                        fontWeight: 500
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
              textAlign: 'center', 
              py: 6,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body1" gutterBottom>
              לא נמצאו פגישות בשם זה.
            </Typography>
            <Typography variant="body2">
              נסה לחפש מחדש או צור פגישה חדשה.
            </Typography>
          </Box>
        )}
      </Paper>

      {selectedMeeting && (
        <UpdateMeetingDialog 
          open={Boolean(selectedMeeting)} 
          handleClose={() => setSelectedMeeting(null)} 
          meeting={selectedMeeting} 
          onUpdate={handleUpdate} 
        />
      )}
    </Container>
  );
}