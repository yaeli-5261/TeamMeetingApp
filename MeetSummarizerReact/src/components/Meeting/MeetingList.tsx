import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Edit } from "lucide-react";
import { Card, CardContent, Typography, Button, Container, IconButton, Box, Avatar } from "@mui/material";
// import FileUploader from "../FileUploader";
import UpdateMeetingDialog from "./UpdateMeetingDialog";
import { MeetingDTO } from "../../models/meetingTypes";
import { fetchMeetingsByTeam } from "../../store/meetingSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface MeetingListProps {
  meetings?: MeetingDTO[];
}

export default function MeetingList({ meetings: meetingsFromProps }: MeetingListProps) {
  const [meetings, setMeetings] = useState<MeetingDTO[]>(meetingsFromProps || []);
  const [loading, setLoading] = useState(!meetingsFromProps);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null);
  const navigate = useNavigate();
  const user= useSelector((state: RootState) => state.Auth.user);
  useEffect(() => {
    if (!meetingsFromProps) {
      const getMeetings = async () => {
        setLoading(true);
        const response = user.teamId ? fetchMeetingsByTeam({ teamId: user.teamId }) : [];
        setLoading(false);
      };
      getMeetings();
    }
  }, [meetingsFromProps]);

  const handleUpdate = (updatedMeeting: MeetingDTO) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) => (meeting.id === updatedMeeting.id ? updatedMeeting : meeting))
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 5, bgcolor: "#f9f9f9", borderRadius: 3, boxShadow: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="#37474F">
          📅 רשימת פגישות
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#5C6BC0",
              color: "white",
              '&:hover': { bgcolor: "#3F51B5" },
              fontWeight: "bold",
            }}
            startIcon={<PlusCircle size={24} />}
            onClick={() => navigate("/add-meeting")}
          >
            הוספת פגישה חדשה
          </Button>
        </Box>

        {loading ? (
          <Typography textAlign="center" color="gray">טוען...</Typography>
        ) : meetings.length > 0 ? (
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}>
            {meetings.map((meeting) => (
              <motion.div key={meeting.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card sx={{ mb: 2, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "#5C6BC0", mr: 2 }}>{meeting.name.charAt(0)}</Avatar>
                      <Typography variant="h6" fontWeight="bold" color="#263238">{meeting.name}</Typography>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>📅 <strong>תאריך:</strong> {meeting.date}</Typography>
                   
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#4CAF50",
                          color: "white",
                          '&:hover': { bgcolor: "#388E3C" },
                          fontWeight: "bold",
                        }}
                        onClick={() => navigate(`/meeting-details/${meeting.id}`)}
                      >
                        הצג פרטים
                      </Button>
                      </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Typography textAlign="center" color="gray">אין פגישות זמינות כרגע.</Typography>
        )}
      </motion.div>

      {selectedMeeting && (
        <UpdateMeetingDialog open={Boolean(selectedMeeting)} handleClose={() => setSelectedMeeting(null)} meeting={selectedMeeting} onUpdate={handleUpdate} />
      )}
    </Container>
  );
}
