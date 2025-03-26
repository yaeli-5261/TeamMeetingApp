import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Typography, Container, Box, IconButton } from "@mui/material";
import { Edit } from "lucide-react";
import UpdateMeetingDialog from "./UpdateMeetingDialog";
import axios from "axios";
import FileUploader from "../FileUploader";
import { MeetingDTO } from "../../models/meetingTypes";
import { fetchMeetingById } from "../../services/meetingService";

export default function MeetingDetails() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<MeetingDTO | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMeeting = async () => {
      const data = await fetchMeetingById(Number(meetingId));
      setMeeting(data);
    };
    getMeeting();
  }, [meetingId]);

  const handleUpdate = (updatedMeeting: MeetingDTO) => {
    setMeeting(updatedMeeting);
  };

  if (!meeting) {
    return <Typography>Loading...</Typography>;
  }
  ///////הוספת פונקציה לעדכון קובץ תמלול
  const updateMeetingFile = async (meeting: MeetingDTO, fileUrl: string) => {
    if (!meeting) return;
  
    const updatedMeeting = { ...meeting, linkTranscriptFile: fileUrl };
  
    try {
      // קריאה ל-API לעדכון הפגישה במסד הנתונים
      await axios.put(`https://localhost:7214/api/meetings/${meeting.id}`, updatedMeeting);
  
      // עדכון הסטייט
      setMeeting(updatedMeeting);
    } catch (error) {
      console.error("❌ שגיאה בעדכון הפגישה:", error);
    }
  };
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Meeting Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6"><strong>Name:</strong> {meeting.name}</Typography>
        <Typography variant="body1"><strong>Date:</strong> {meeting.date}</Typography>
        <Typography variant="body1"><strong>Transcript File:</strong> {meeting.linkTranscriptFile ? (
          <a href={meeting.linkTranscriptFile} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#007bff", fontWeight: "bold" }}>
            {meeting.linkTranscriptFile}
          </a>
        ) : "No File"}</Typography>
        <Typography variant="body1"><strong>Origin File:</strong> {meeting.linkOrinignFile ? (
          <a href={meeting.linkOrinignFile} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#007bff", fontWeight: "bold" }}>
            {meeting.linkOrinignFile}
          </a>
        ) : "No File"}</Typography>
      </Box>
                     
      <Typography color="textSecondary" gutterBottom>
                      🔗 <strong>קובץ תמלול:</strong> {meeting.linkTranscriptFile ? (
                        <a href={meeting.linkTranscriptFile} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#3F51B5", fontWeight: "bold" }}>
                          הצג קובץ
                        </a>
                      ) : "אין קובץ"}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <FileUploader />
                      </Box>
                     
      <IconButton color="primary" onClick={() => setSelectedMeeting(meeting)}>
        <Edit />
      </IconButton>

      {selectedMeeting && (
        <UpdateMeetingDialog open={Boolean(selectedMeeting)} handleClose={() => setSelectedMeeting(null)} meeting={selectedMeeting} onUpdate={handleUpdate} />
      )}
    </Container>
  );
}
