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
