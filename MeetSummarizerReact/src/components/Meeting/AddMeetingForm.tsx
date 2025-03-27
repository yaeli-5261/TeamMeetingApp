import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store"; // ודא שזה הנתיב הנכון
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { motion } from "framer-motion";
import { addMeeting } from "../../store/meetingSlice";

export default function AddMeetingForm() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // קבלת ה-teamId מהמשתמש המחובר
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const teamId = user?.teamId || null; // ודא שיש teamId תקף

    const [meetingData, setMeetingData] = useState({
        name: "",
        date: "",
        linkTranscriptFile: "",
        linkOrinignFile: "",
        teamId: teamId, // מוודא שה-ID של הצוות נשלח
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!meetingData.teamId) {
            alert("❌ Team ID is missing. Please try again.");
            return;
        }

        try {
            const addedMeeting = await dispatch(addMeeting(meetingData)).unwrap();

            if (addedMeeting) {
                console.log("✅ Meeting added successfully!", addedMeeting);
                setMeetingData({ name: "", date: "", linkTranscriptFile: "", linkOrinignFile: "", teamId: teamId }); // איפוס הטופס
                navigate("/meetings"); // חזרה לרשימה
            }
        } catch (error) {
            console.error("❌ Error adding meeting:", error);
            alert("❌ Failed to add meeting. Please try again.");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={5} sx={{ 
                padding: 4, 
                maxWidth: 450, 
                margin: "auto", 
                textAlign: "center", 
                borderRadius: 3,
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                color: "white"
            }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <EventNoteIcon sx={{ fontSize: 40, color: "#ffd700" }} />
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Add a new meeting
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Meeting name"
                        name="name"
                        value={meetingData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
                    />
                    <TextField
                        label="Meeting date and time"
                        name="date"
                        type="datetime-local"
                        value={meetingData.date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
                    />
                    <TextField
                        label="🔗 Link to transcript file (optional)"
                        name="linkTranscriptFile"
                        value={meetingData.linkTranscriptFile}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
                    />
                    <TextField
                        label="📂 Link to original file (optional)"
                        name="linkOrinignFile"
                        value={meetingData.linkOrinignFile}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ mt: 3, borderRadius: 3, backgroundColor: "#ffd700", color: "black", fontWeight: "bold", '&:hover': { backgroundColor: "#ffcc00" } }}
                        fullWidth
                    >
                        🚀 Add Meeting
                    </Button>
                </form>
            </Paper>
        </motion.div>
    );
}
