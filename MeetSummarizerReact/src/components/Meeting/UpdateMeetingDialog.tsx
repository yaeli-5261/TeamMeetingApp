// import { useState } from "react";
// import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
// import { updateMeeting } from "../Api/meetingService";
// import { MeetingDTO } from "../Api/meetingTypes";

// interface UpdateMeetingDialogProps {
//     open: boolean;
//     handleClose: () => void;
//     meeting: MeetingDTO;
//     onUpdate: (updatedMeeting: MeetingDTO) => void;
// }

// export default function UpdateMeetingDialog({ open, handleClose, meeting, onUpdate }: UpdateMeetingDialogProps) {
//     const [formData, setFormData] = useState({ ...meeting });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async () => {
//         const updatedMeeting = await updateMeeting(meeting.id, formData);
//         if (updatedMeeting) {
//             onUpdate(updatedMeeting);
//             handleClose();
//         }
//     };

//     return (
//         <Dialog open={open} onClose={handleClose} fullWidth>
//             <DialogTitle>עדכון ישיבה</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     margin="dense"
//                     label="שם הפגישה"
//                     name="name"
//                     fullWidth
//                     value={formData.name}
//                     onChange={handleChange}
//                 />
//                 <TextField
//                     margin="dense"
//                     label="תאריך הפגישה"
//                     name="date"
//                     type="datetime-local"
//                     fullWidth
//                     value={formData.date}
//                     onChange={handleChange}
//                 />
//                 <TextField
//                     margin="dense"
//                     label="קובץ תמלול"
//                     name="linkTranscriptFile"
//                     fullWidth
//                     value={formData.linkTranscriptFile || ""}
//                     onChange={handleChange}
//                 />
//                 <TextField
//                     margin="dense"
//                     label="קובץ מקור"
//                     name="linkOrinignFile"
//                     fullWidth
//                     value={formData.linkOrinignFile || ""}
//                     onChange={handleChange}
//                 />
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleClose} color="secondary">ביטול</Button>
//                 <Button onClick={handleSubmit} color="primary">עדכן</Button>
//             </DialogActions>
//         </Dialog>
//     );
// }


import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { MeetingDTO } from "../../models/meetingTypes";
import { updateMeeting } from "../../services/meetingService";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

interface UpdateMeetingDialogProps {
    open: boolean;
    handleClose: () => void;
    meeting: MeetingDTO;
    onUpdate: (updatedMeeting: MeetingDTO) => void;
}

export default function UpdateMeetingDialog({ open, handleClose, meeting, onUpdate }: UpdateMeetingDialogProps) {
    const [formData, setFormData] = useState({ ...meeting });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const updatedMeeting = await updateMeeting(meeting.id, formData);
        if (updatedMeeting) {
            onUpdate(updatedMeeting);
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Update Meeting</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Meeting Name"
                    name="name"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Meeting Date"
                    name="date"
                    type="datetime-local"
                    fullWidth
                    value={formData.date}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Transcript File"
                    name="linkTranscriptFile"
                    fullWidth
                    value={formData.linkTranscriptFile || ""}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Original File"
                    name="linkOrinignFile"
                    fullWidth
                    value={formData.linkOrinignFile || ""}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    );
}
