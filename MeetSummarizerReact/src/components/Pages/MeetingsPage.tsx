// import { useEffect, useState } from "react";
// import { fetchMeetingsByTeam } from "../Api/meetingService"; // שמור את הפונקציה לשליפת הפגישות
// import MeetingList from "../Meeting/MeetingList"; // הצגת הפגישות ברשימה
// import { MeetingDTO } from "../Api/meetingTypes";

// const MeetingsPage = () => {
//     const [meetings, setMeetings] = useState<MeetingDTO[]>([]); // שמור את הפגישות בסטייט
//     const [loading, setLoading] = useState(true); // טוען נתונים מה-API

//     // השתמש ב-`useEffect` כדי לשלוף את הפגישות כשהדף נטען
//     useEffect(() => {
//         const loadMeetings = async () => {
//             setLoading(true);
//             const data = await fetchMeetingsByTeam(); // שלוף את הפגישות עבור ה-teamId של המשתמש
//             setMeetings(data); // עדכן את הסטייט עם הפגישות
//             setLoading(false);
//         };
//         loadMeetings(); // קריאה לפונקציה לשליפת הפגישות
//     }, []); // ריצה רק בפעם הראשונה שהעמוד נטען

//     return (
//         <div className="p-6 max-w-3xl mx-auto">
//             <h1 className="text-3xl font-bold text-center mb-6">ניהול ישיבות</h1>
//             {loading ? (
//                 <p className="text-gray-500 text-center mt-4">טוען ישיבות...</p> // הצגת הודעת טוען בזמן שליפת הנתונים
//             ) : (
//                 <MeetingList meetings={meetings} /> // הצגת רשימת הפגישות
//             )}
//         </div>
//     );
// };

// export default MeetingsPage;






import { useEffect, useState } from "react";
import MeetingList from "../Meeting/MeetingList";
import { Box, Typography } from "@mui/material";
import { MeetingDTO } from "../../models/meetingTypes";
//TODO: change to store...
import { fetchMeetingsByTeam } from "../../services/meetingService";

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState<MeetingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      setLoading(true);
      const data = await fetchMeetingsByTeam();
      setMeetings(data);
      setLoading(false);
    };
    loadMeetings();
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        ניהול ישיבות
      </Typography>
      {loading ? (
        <Typography variant="h6" align="center" color="textSecondary">
          טוען ישיבות...
        </Typography>
      ) : (
        <MeetingList meetings={meetings} />
      )}
    </Box>
  );
};

export default MeetingsPage;
