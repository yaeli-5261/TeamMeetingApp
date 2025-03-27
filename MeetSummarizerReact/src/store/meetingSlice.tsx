
import { createSlice, createAsyncThunk, PayloadAction, AsyncThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { MeetingDTO, MeetingPostDTO } from "../models/meetingTypes";
import { getCookie } from "../components/login/SignIn";


const API_URL = "https://localhost:7214/api/Meeting";
// Define the initial state

// Async thunk for updating the meeting file link
export const updateMeetingFile = createAsyncThunk(
  "meetings/updateMeetingFile",
  async (
    { meetingId, fileUrl, isTranscript }: { meetingId: number; fileUrl: string; isTranscript: boolean },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(`${API_URL}/update-meeting-file`, {
        MeetingId: meetingId,
        FileUrl: fileUrl,
        IsTranscript: isTranscript,
      });
      return { meetingId, fileUrl };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update meeting file");
    }
  }
);

// Async thunk for fetching all meetings
export const fetchMeetings = createAsyncThunk(
  "meetings/fetchMeetings",
  async (_, thunkAPI) => {
    const userData = localStorage.getItem("user");

    const user = userData ? JSON.parse(userData) : null;
    console.log("User data from localStorage:", user);

    const teamId = user.teamId;
    if (!teamId) {
      console.error("❌ No TeamId found for the user.");
      return [];
    }

    try {
      const response = await axios.get<MeetingDTO[]>(`${API_URL}/Team/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch meetings");
    }
  }
);
export const fetchMeetingsByTeam = createAsyncThunk(
  "meetings/fetchMeetingsByTeam",
  async ({ teamId }: { teamId: number }, thunkAPI) => {
    try {
      const token = getCookie('auth_token');
      const response = await axios.get(`${API_URL}/team/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as any).response?.data || "An unknown error occurred");
    }
  }
);
// Async thunk for fetching meetings by team ID
// export const fetchMeetingsByTeam = createAsyncThunk(
//   "meetings/fetchMeetingsByTeam",
//   async (teamId: number, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/meeting/team/${teamId}`);
//       return response.data as MeetingDTO[];
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch meetings by team");
//     }
//   }
// );

// Async thunk for adding a new meeting
export const addMeeting = createAsyncThunk(
  "meetings/addMeeting",
  async (meeting: MeetingPostDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, meeting);
      return response.data as MeetingDTO;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add meeting");
    }
  }
);

// Async thunk for deleting a meeting
export const deleteMeeting = createAsyncThunk(
  "meetings/deleteMeeting",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete meeting");
    }
  }
);

// Create the slice
const meetingSlice = createSlice({
  name: "meetings",
  initialState: { list: [] as MeetingDTO[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch meetings
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        console.log(state.list);

      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      // Fetch meetings by team
      .addCase(fetchMeetingsByTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeetingsByTeam.fulfilled, (state, action: PayloadAction<MeetingDTO[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMeetingsByTeam.rejected, (state, action) => {
        state.loading = false;
        console.error('failed', action.payload);
      })
      // Add meeting
      .addCase(addMeeting.fulfilled, (state, action: PayloadAction<MeetingDTO>) => {
        state.list.push(action.payload);
      })
      .addCase(addMeeting.rejected, (state, action) => {
        console.error('failed', action.payload);
      })
      // Delete meeting
      .addCase(deleteMeeting.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter((meeting) => meeting.id !== action.payload);
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        console.error('failed', action.payload);
      })
      // Update meeting file
      .addCase(updateMeetingFile.fulfilled, (state, action) => {
        const { meetingId, fileUrl } = action.payload;
        const meeting = state.list.find((m) => m.id === meetingId);
        if (meeting) {
          meeting.linkOrinignFile = fileUrl; // Update the file URL in the meeting
        }
      })
      .addCase(updateMeetingFile.rejected, (state, action) => {
        console.error('failed', action.payload);
      });
  },
});

export default meetingSlice;

