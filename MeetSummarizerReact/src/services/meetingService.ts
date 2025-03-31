import axios from "axios"
import type { MeetingDTO } from "../models/meetingTypes"

const API_URL = "https://localhost:7214/api/Meeting"

// פונקציה לקבלת ערך מ-cookie
export const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || ""
  }
  return ""
}

// קבלת טוקן מה-Cookie
const getAuthToken = (): string => {
  return getCookie("auth_token")
}

// קבלת teamId של המשתמש המחובר מה-sessionStorage
const getUserTeamId = (): number | null => {
  const userData = sessionStorage.getItem("user")
  if (userData) {
    const user = JSON.parse(userData)
    console.log("User data from sessionStorage:", user)
    return user.teamId
  }
  return null
}

// שליפת פגישות לפי teamId
export const fetchMeetingsByTeam = async (): Promise<MeetingDTO[]> => {
  const teamId = getUserTeamId()
  if (!teamId) {
    console.error("❌ No TeamId found for the user.")
    return []
  }

  try {
    const response = await axios.get<MeetingDTO[]>(`${API_URL}/Team/${teamId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("❌ Error fetching meetings:", error)
    return []
  }
}

// ✅ **פונקציה להוספת פגישה**
export const addMeeting = async (meetingData: {
  name: string
  date: string
  linkTranscriptFile?: string
  linkOrinignFile?: string
}): Promise<MeetingDTO | null> => {
  const teamId = getUserTeamId()
  if (!teamId) {
    console.error("❌ No TeamId found for the user.")
    return null
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
      },
    )
    console.log("✅ Meeting added successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error adding meeting:", error)
    return null
  }
}

// פונקציה לעדכון פגישה
export const updateMeeting = async (id: number, meetingData: Partial<MeetingDTO>): Promise<MeetingDTO | null> => {
  try {
    const response = await axios.put<MeetingDTO>(`${API_URL}/${id}`, meetingData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    })
    console.log("✅ Meeting updated successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error updating meeting:", error)
    return null
  }
}

// שליפת פגישה לפי מזהה
export const fetchMeetingById = async (id: number): Promise<MeetingDTO> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(`❌ Error fetching meeting with ID ${id}:`, error)
    throw error
  }
}

// פונקציה למחיקת פגישה
export const deleteMeeting = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
    console.log("✅ Meeting deleted successfully:", response.data)
    return true
  } catch (error) {
    console.error(`❌ Error deleting meeting with ID ${id}:`, error)
    return false
  }
}

