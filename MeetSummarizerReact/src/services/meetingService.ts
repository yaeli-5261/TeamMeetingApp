import axios from "axios";
import { MeetingDTO } from "../models/meetingTypes";
import { getCookie } from "../components/login/SignIn";

const API_URL = "https://localhost:7214/api/Meeting";

// קבלת טוקן מה-LocalStorage
const getAuthToken = () => getCookie("auth_token");

// קבלת teamId של המשתמש המחובר
const getUserTeamId = (): number | null => {
    const userData = localStorage.getItem("user");
    if (userData) {
        const user = JSON.parse(userData);
        console.log("User data from localStorage:", user);
        return user.teamId;
    }
    return null;
};

// שליפת פגישות לפי teamId
export const fetchMeetingsByTeam = async (): Promise<MeetingDTO[]> => {
    const teamId = getUserTeamId();
    if (!teamId) {
        console.error("❌ No TeamId found for the user.");
        return [];
    }

    try {
        const response = await axios.get<MeetingDTO[]>(`${API_URL}/Team/${teamId}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching meetings:", error);
        return [];
    }
   
   
};


// ✅ **פונקציה להוספת פגישה**
export const addMeeting = async (meetingData: {
    name: string;
    date: string;
    linkTranscriptFile?: string;
    linkOrinignFile?: string;
}): Promise<MeetingDTO | null> => {
    const teamId = getUserTeamId();
    if (!teamId) {
        console.error("❌ No TeamId found for the user.");
        return null;
    }

    try {
        const response = await axios.post<MeetingDTO>(
            API_URL,
            { ...meetingData, teamId }, // מוסיפים teamId מהמשתמש המחובר
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("✅ Meeting added successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error adding meeting:", error);
        return null;
    }
};

// פונקציה לעדכון פגישה
export const updateMeeting = async (id: number, meetingData: Partial<MeetingDTO>): Promise<MeetingDTO | null> => {
    try {
        const response = await axios.put<MeetingDTO>(
            `${API_URL}/${id}`,
            meetingData,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("✅ Meeting updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating meeting:", error);
        return null;
    }
};


const API_BASE_URL = "https://localhost:7214/api/Meeting"; // עדכני ל-URL של ה-API שלך

export const fetchMeetingById = async (id: number): Promise<MeetingDTO> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};


// export const updateMeetingFile = async (meetingId: number, fileUrl: string): Promise<void> => {
//   await axios.post(`${API_BASE_URL}/update-meeting-file`, { meetingId, fileUrl });
// };


//

  