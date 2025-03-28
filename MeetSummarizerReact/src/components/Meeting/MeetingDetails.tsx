import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Typography, Container, Box, IconButton, Dialog, DialogContent } from "@mui/material";
import { Edit } from "lucide-react";
import UpdateMeetingDialog from "./UpdateMeetingDialog";
import axios from "axios";
import { MeetingDTO } from "../../models/meetingTypes";
import { fetchMeetingById } from "../../services/meetingService";
import FileUploader from "../File/FileUploader";

export default function MeetingDetails() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<MeetingDTO | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
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

  const fetchFileContent = async (fileUrl: string) => {
    try {
      const response = await axios.get(fileUrl, { responseType: "text" });
      setFileContent(response.data);
      setIsFileDialogOpen(true);
    } catch (error) {
      console.error("❌ שגיאה בטעינת תוכן הקובץ:", error);
      setFileContent("⚠️ שגיאה בטעינת הקובץ");
      setIsFileDialogOpen(true);
    }
  };

  if (!meeting) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Meeting Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          <strong>Name:</strong> {meeting.name}
        </Typography>
        <Typography variant="body1">
          <strong>Date:</strong> {meeting.date}
        </Typography>
      </Box>

      {meeting.linkTranscriptFile ? (
        <>
          <Typography color="textSecondary" gutterBottom>
            🔗 <strong>קובץ תמלול:</strong>{" "}
            <a
              href={meeting.linkTranscriptFile}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#3F51B5", fontWeight: "bold" }}
            >
              הצג קובץ
            </a>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => fetchFileContent(meeting.linkTranscriptFile!)}
          >
            הצג תוכן הקובץ
          </Button>

          <Dialog fullScreen open={isFileDialogOpen} onClose={() => setIsFileDialogOpen(false)}>
            <DialogContent sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                תוכן הקובץ
              </Typography>
              <Typography variant="body1" component="pre" sx={{ whiteSpace: "pre-wrap", overflowY: "auto", height: "100%" }}>
                {fileContent}
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => setIsFileDialogOpen(false)}>
                סגור
              </Button>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <FileUploader />
      )}

      <IconButton color="primary" onClick={() => setSelectedMeeting(meeting)}>
        <Edit />
      </IconButton>

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
