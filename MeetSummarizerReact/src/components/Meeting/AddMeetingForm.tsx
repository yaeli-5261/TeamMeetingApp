// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../store/store"; // ודא שזה הנתיב הנכון
// import { TextField, Button, Paper, Typography, Box } from "@mui/material";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import { motion } from "framer-motion";
// import { addMeeting } from "../../store/meetingSlice";

// export default function AddMeetingForm() {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     // קבלת ה-teamId מהמשתמש המחובר
//     const userData = localStorage.getItem("user");
//     const user = userData ? JSON.parse(userData) : null;
//     const teamId = user?.teamId || null; // ודא שיש teamId תקף

//     const [meetingData, setMeetingData] = useState({
//         name: "",
//         date: "",
//         linkTranscriptFile: "",
//         linkOrinignFile: "",
//         teamId: teamId, // מוודא שה-ID של הצוות נשלח
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!meetingData.teamId) {
//             alert("❌ Team ID is missing. Please try again.");
//             return;
//         }

//         try {
//             const addedMeeting = await dispatch(addMeeting(meetingData)).unwrap();

//             if (addedMeeting) {
//                 console.log("✅ Meeting added successfully!", addedMeeting);
//                 setMeetingData({ name: "", date: "", linkTranscriptFile: "", linkOrinignFile: "", teamId: teamId }); // איפוס הטופס
//                 navigate("/meetings"); // חזרה לרשימה
//             }
//         } catch (error) {
//             console.error("❌ Error adding meeting:", error);
//             alert("❌ Failed to add meeting. Please try again.");
//         }
//     };

//     return (
//         <motion.div 
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//         >
//             <Paper elevation={5} sx={{ 
//                 padding: 4, 
//                 maxWidth: 450, 
//                 margin: "auto", 
//                 textAlign: "center", 
//                 borderRadius: 3,
//                 background: "linear-gradient(135deg, #6a11cb, #2575fc)",
//                 color: "white"
//             }}>
//                 <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
//                     <EventNoteIcon sx={{ fontSize: 40, color: "#ffd700" }} />
//                 </Box>
//                 <Typography variant="h5" gutterBottom fontWeight="bold">
//                     Add a new meeting
//                 </Typography>
//                 <form onSubmit={handleSubmit}>
//                     <TextField
//                         label="Meeting name"
//                         name="name"
//                         value={meetingData.name}
//                         onChange={handleChange}
//                         fullWidth
//                         margin="normal"
//                         required
//                         InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
//                     />
//                     <TextField
//                         label="Meeting date and time"
//                         name="date"
//                         type="datetime-local"
//                         value={meetingData.date}
//                         onChange={handleChange}
//                         fullWidth
//                         margin="normal"
//                         required
//                         InputLabelProps={{ shrink: true }}
//                         InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
//                     />
//                     <TextField
//                         label="🔗 Link to transcript file (optional)"
//                         name="linkTranscriptFile"
//                         value={meetingData.linkTranscriptFile}
//                         onChange={handleChange}
//                         fullWidth
//                         margin="normal"
//                         InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
//                     />
//                     <TextField
//                         label="📂 Link to original file (optional)"
//                         name="linkOrinignFile"
//                         value={meetingData.linkOrinignFile}
//                         onChange={handleChange}
//                         fullWidth
//                         margin="normal"
//                         InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
//                     />
//                     <Button 
//                         type="submit" 
//                         variant="contained" 
//                         sx={{ mt: 3, borderRadius: 3, backgroundColor: "#ffd700", color: "black", fontWeight: "bold", '&:hover': { backgroundColor: "#ffcc00" } }}
//                         fullWidth
//                     >
//                         🚀 Add Meeting
//                     </Button>
//                 </form>
//             </Paper>
//         </motion.div>
//     );
// }








import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
  useMediaQuery,
  FormHelperText,
  Avatar,
  Stack,
  Switch,
  FormControlLabel,
  SelectChangeEvent
} from "@mui/material";
import { 
  EventNote as EventNoteIcon,
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  AttachFile as AttachFileIcon,
  CalendarMonth as CalendarIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  Add as AddIcon,
  Check as CheckIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { addMeeting } from "../../store/meetingSlice";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';

// סוגי פגישות לדוגמה
const meetingTypes = [
  { id: 1, name: "פגישת צוות" },
  { id: 2, name: "פגישת תכנון" },
  { id: 3, name: "סקירת פרויקט" },
  { id: 4, name: "ראיון" },
  { id: 5, name: "אחר" }
];

// משתתפים לדוגמה
const sampleParticipants = [
  { id: 1, name: "דניאל כהן", email: "daniel@example.com", avatar: "D" },
  { id: 2, name: "מיכל לוי", email: "michal@example.com", avatar: "M" },
  { id: 3, name: "יוסי אברהם", email: "yossi@example.com", avatar: "Y" },
  { id: 4, name: "רונית שלום", email: "ronit@example.com", avatar: "R" }
];

export default function AddMeetingForm() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    // קבלת ה-teamId מהמשתמש המחובר
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const teamId = user?.teamId || null;
    
    // שלבי הטופס
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['פרטי פגישה', 'קבצים וקישורים', 'משתתפים'];
    
    // מצב הטופס
    const [meetingData, setMeetingData] = useState({
        name: "",
        description: "",
        type: 1, // ברירת מחדל: פגישת צוות
        date: new Date().toISOString(),
        duration: 60, // דקות
        location: "",
        linkTranscriptFile: "",
        linkOrinignFile: "",
        isRecurring: false,
        teamId: teamId,
        participants: [] as number[]
    });
    
    // מצב שגיאות
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // מצב הודעות
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "info" | "warning"
    });
    
    // מצב טעינה
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // בדיקת תקינות הטופס
    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        
        if (step === 0) {
            if (!meetingData.name.trim()) newErrors.name = "שם הפגישה הוא שדה חובה";
            if (!meetingData.date) newErrors.date = "תאריך הפגישה הוא שדה חובה";
            if (meetingData.duration <= 0) newErrors.duration = "משך הפגישה חייב להיות חיובי";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // מעבר לשלב הבא
    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };
    
    // מעבר לשלב הקודם
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };
    
    // טיפול בשינויים בטופס
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name) {
            setMeetingData({ ...meetingData, [name]: value });
    
            // ניקוי שגיאה אם קיימת
            if (errors[name]) {
                setErrors({ ...errors, [name]: "" });
            }
        }
    };
    
    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        const { name, value } = event.target;
        if (name) {
            setMeetingData({ ...meetingData, [name]: value });
    
            // ניקוי שגיאה אם קיימת
            if (errors[name]) {
                setErrors({ ...errors, [name]: "" });
            }
        }
    };
    
    // טיפול בשינוי תאריך
    const handleDateChange = (newDate: Date | null) => {
        if (newDate) {
            setMeetingData({ ...meetingData, date: newDate.toISOString() });
            if (errors.date) {
                setErrors({ ...errors, date: "" });
            }
        }
    };
    
    // טיפול בשינוי מתג
    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMeetingData({ ...meetingData, [e.target.name]: e.target.checked });
    };
    
    // טיפול במשתתפים
    const handleParticipantToggle = (participantId: number) => {
        const currentParticipants = [...meetingData.participants];
        const participantIndex = currentParticipants.indexOf(participantId);
        
        if (participantIndex === -1) {
            // הוספת משתתף
            currentParticipants.push(participantId);
        } else {
            // הסרת משתתף
            currentParticipants.splice(participantIndex, 1);
        }
        
        setMeetingData({ ...meetingData, participants: currentParticipants });
    };
    
    // שליחת הטופס
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateStep(activeStep)) {
            return;
        }
        
        if (!meetingData.teamId) {
            setSnackbar({
                open: true,
                message: "❌ מזהה צוות חסר. אנא נסה שוב.",
                severity: "error"
            });
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const addedMeeting = await dispatch(addMeeting(meetingData)).unwrap();
            
            if (addedMeeting) {
                setSnackbar({
                    open: true,
                    message: "✅ הפגישה נוספה בהצלחה!",
                    severity: "success"
                });
                
                // איפוס הטופס
                setMeetingData({
                    name: "",
                    description: "",
                    type: 1,
                    date: new Date().toISOString(),
                    duration: 60,
                    location: "",
                    linkTranscriptFile: "",
                    linkOrinignFile: "",
                    isRecurring: false,
                    teamId: teamId,
                    participants: []
                });
                
                // חזרה לרשימת הפגישות לאחר 1.5 שניות
                setTimeout(() => {
                    navigate("/meetings");
                }, 1500);
            }
        } catch (error) {
            console.error("❌ Error adding meeting:", error);
            setSnackbar({
                open: true,
                message: "❌ הוספת הפגישה נכשלה. אנא נסה שוב.",
                severity: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // סגירת הודעת Snackbar
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    
    // ביטול והחזרה לרשימת הפגישות
    const handleCancel = () => {
        navigate("/meetings");
    };

    return (
        <Box 
            sx={{ 
                width: '100%',
                ml: { xs: 0, md: '250px' }, // מרווח שמאלי בגודל התפריט במסכים גדולים
                transition: 'margin 0.3s',
                boxSizing: 'border-box',
                p: { xs: 2, md: 3 },
                maxWidth: { xs: '100%', md: 'calc(100% - 250px)' }
            }}
        >
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <IconButton 
                            onClick={handleCancel}
                            sx={{ mr: 2 }}
                            aria-label="חזרה לרשימת הפגישות"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: 40,
                                    height: 40,
                                    mr: 2
                                }}
                            >
                                <EventNoteIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight={600}>
                                הוספת פגישה חדשה
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Stepper 
                        activeStep={activeStep} 
                        alternativeLabel={!isMobile}
                        orientation={isMobile ? "vertical" : "horizontal"}
                        sx={{ mb: 4 }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    
                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                            onChange={handleSelectChange}
                            >
                                {activeStep === 0 && (
                                    <Box>
                                        <Typography variant="h6" fontWeight={500} gutterBottom>
                                            פרטי הפגישה
                                        </Typography>
                                        
                                        <TextField
                                            label="שם הפגישה"
                                            name="name"
                                            value={meetingData.name}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            required
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DescriptionIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        
                                        <TextField
                                            label="תיאור הפגישה"
                                            name="description"
                                            value={meetingData.description}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={3}
                                        />
                                        
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>סוג פגישה</InputLabel>
                                            <Select
                                                name="type"
                                                value={meetingData.type}
                                                onChange={handleChange}
                                                label="סוג פגישה"
                                            >
                                                {meetingTypes.map((type) => (
                                                    <MenuItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        
                                        <Box sx={{ mt: 2 }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
                                                <DateTimePicker
                                                    label="תאריך ושעה"
                                                    value={new Date(meetingData.date)}
                                                    onChange={handleDateChange}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            margin: "normal",
                                                            required: true,
                                                            error: !!errors.date,
                                                            helperText: errors.date,
                                                            InputProps: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <CalendarIcon fontSize="small" />
                                                                    </InputAdornment>
                                                                ),
                                                            }
                                                        }
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                        
                                        <TextField
                                            label="משך הפגישה (דקות)"
                                            name="duration"
                                            type="number"
                                            value={meetingData.duration}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            required
                                            error={!!errors.duration}
                                            helperText={errors.duration}
                                            InputProps={{
                                                inputProps: { min: 1 }
                                            }}
                                        />
                                        
                                        <TextField
                                            label="מיקום הפגישה"
                                            name="location"
                                            value={meetingData.location}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            placeholder="חדר ישיבות, Zoom, Teams וכו'"
                                        />
                                        
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={meetingData.isRecurring}
                                                    onChange={handleSwitchChange}
                                                    name="isRecurring"
                                                    color="primary"
                                                />
                                            }
                                            label="פגישה חוזרת"
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                )}
                                
                                {activeStep === 1 && (
                                    <Box>
                                        <Typography variant="h6" fontWeight={500} gutterBottom>
                                            קבצים וקישורים
                                        </Typography>
                                        
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            ניתן להוסיף קישורים לקבצים קיימים כעת, או להעלות קבצים לאחר יצירת הפגישה.
                                        </Alert>
                                        
                                        <TextField
                                            label="קישור לקובץ תמלול"
                                            name="linkTranscriptFile"
                                            value={meetingData.linkTranscriptFile}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            placeholder="https://example.com/transcript.txt"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <FormHelperText sx={{ mt: 0, mb: 2 }}>
                                            קישור לקובץ תמלול הפגישה (אופציונלי)
                                        </FormHelperText>
                                        
                                        <TextField
                                            label="קישור לקובץ מקורי"
                                            name="linkOrinignFile"
                                            value={meetingData.linkOrinignFile}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            placeholder="https://example.com/original.docx"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AttachFileIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <FormHelperText sx={{ mt: 0 }}>
                                            קישור לקובץ המקורי של הפגישה (אופציונלי)
                                        </FormHelperText>
                                        
                                        <Divider sx={{ my: 3 }} />
                                        
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                sx={{ 
                                                    borderStyle: 'dashed',
                                                    textTransform: 'none',
                                                    py: 1.5
                                                }}
                                            >
                                                העלאת קבצים תתאפשר לאחר יצירת הפגישה
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                                
                                {activeStep === 2 && (
                                    <Box>
                                        <Typography variant="h6" fontWeight={500} gutterBottom>
                                            משתתפים
                                        </Typography>
                                        
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            בחר משתתפים שישתתפו בפגישה זו:
                                        </Typography>
                                        
                                        <Box sx={{ mt: 2 }}>
                                            {sampleParticipants.map((participant) => {
                                                const isSelected = meetingData.participants.includes(participant.id);
                                                
                                                return (
                                                    <Paper
                                                        key={participant.id}
                                                        elevation={0}
                                                        sx={{
                                                            p: 2,
                                                            mb: 2,
                                                            borderRadius: 2,
                                                            border: '1px solid',
                                                            borderColor: isSelected ? 'primary.main' : 'divider',
                                                            bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                borderColor: 'primary.main',
                                                                bgcolor: isSelected ? 'primary.lighter' : 'rgba(0, 0, 0, 0.02)'
                                                            }
                                                        }}
                                                        onClick={() => handleParticipantToggle(participant.id)}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar sx={{ mr: 2, bgcolor: isSelected ? 'primary.main' : 'grey.400' }}>
                                                                    {participant.avatar}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body1" fontWeight={500}>
                                                                        {participant.name}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {participant.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            {isSelected && (
                                                                <CheckIcon color="primary" />
                                                            )}
                                                        </Box>
                                                    </Paper>
                                                );
                                            })}
                                        </Box>
                                        
                                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                sx={{ 
                                                    borderStyle: 'dashed',
                                                    textTransform: 'none',
                                                    py: 1.5
                                                }}
                                            >
                                                הוסף משתתף חדש
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Button
                                onClick={handleCancel}
                                startIcon={<CancelIcon />}
                                sx={{ textTransform: 'none' }}
                            >
                                ביטול
                            </Button>
                            
                            <Box>
                                {activeStep > 0 && (
                                    <Button
                                        onClick={handleBack}
                                        sx={{ mr: 1, textTransform: 'none' }}
                                    >
                                        חזרה
                                    </Button>
                                )}
                                
                                {activeStep < steps.length - 1 ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ 
                                            bgcolor: '#1a1a1a',
                                            color: 'white',
                                            textTransform: 'none',
                                            '&:hover': {
                                                bgcolor: '#2c2c2c'
                                            }
                                        }}
                                    >
                                        המשך
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        disabled={isSubmitting}
                                        sx={{ 
                                            bgcolor: '#1a1a1a',
                                            color: 'white',
                                            textTransform: 'none',
                                            '&:hover': {
                                                bgcolor: '#2c2c2c'
                                            }
                                        }}
                                    >
                                        {isSubmitting ? "שומר..." : "שמור פגישה"}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </motion.div>
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}