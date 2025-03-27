import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useParams } from "react-router-dom";
import { getCookie } from "./login/SignIn";
import { fetchMeetings, fetchMeetingsByTeam } from "../store/meetingSlice";
// import { MeetingDTO } from "../models/meetingTypes";









export const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploadUrl, setUploadUrl] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    // const user = useSelector((state: RootState) => state.Auth.user);
    const { meetingId } = useParams<{ meetingId: string }>(); // קבלת ה-meetingId מה-URL
    const dispatch: AppDispatch = useDispatch();

    const meetings = useSelector((state: RootState) => state.meetings.list);
    const [meeting, setMeeting] = useState(meetings.find((meeting) => meeting.id === Number(meetingId)));
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    // const loadMeetings = async () => { 
    // await dispatch(fetchMeetingsByTeam({ teamId: meeting?.teamId || 0 }));
    // console.log(meetings);

    // }
    const loadMeetings = async () => {
        if (!meeting?.teamId) {
            // אם ה-teamId לא קיים בפגישה, ננסה לשלוף אותו מה-localStorage
            const userData = localStorage.getItem("user");
            const user = userData ? JSON.parse(userData) : null;
    
            if (user?.teamId) {
                console.log("🔄 Team ID loaded from localStorage:", user.teamId);
                await dispatch(fetchMeetingsByTeam({ teamId: user.teamId }));
            } else {
                console.error("❌ Team ID is missing in both meeting and localStorage.");
                return;
            }
        } else {
            console.log("🔄 Team ID loaded from meeting:", meeting.teamId);
            await dispatch(fetchMeetingsByTeam({ teamId: meeting.teamId }));
        }
    
        console.log(meetings);
    };

    // useEffect(() => {
    //     console.log(meetingId);
    //     loadMeetings();
    //     console.log(meetings);
    //     setMeeting(meetings.find((meeting) => meeting.id === Number(meetingId)));
    //     console.log(meeting);
    // }, [meetingId]);

    useEffect(() => {
        console.log(meetingId);
        loadMeetings();
        setMeeting(meetings.find((meeting) => meeting.id === Number(meetingId)));
        console.log(meeting);
    }, [meetingId]);


    // useEffect(() => {
    //     console.log("🔄 Reloading meetings for meetingId:", meetingId);
    //     dispatch(fetchMeetingsByTeam({ teamId: meeting?.teamId || 0 }));
    // }, [meetingId]);
    
    // useEffect(() => {
    //     if (meetings.length > 0) {
    //     const foundMeeting = meetings.find((meeting) => meeting.id === Number(meetingId));
    //     setMeeting(foundMeeting);
    //     console.log("📌 Updated meeting:", foundMeeting);
    //     }
    // }, [meetings, meetingId]);
    

    const handleUpload = async () => {
        if (!file) {
            alert("❌ יש לבחור קובץ.");
            return;
        }

        if (!meetingId) {
            alert("❌ לא נמצא meetingId ב-URL.");
            return;
        }

        try {
            console.log(meeting);

            // שלב 1: בקשת Presigned URL מהשרת
            const response = await axios.get('https://localhost:7214/api/upload/presigned-url', {
                params: {
                    fileName: `${meeting?.teamId}/${file.name}`,
                    contentType: file.type
                },
                headers: {
                    "Authorization": `Bearer ${getCookie("auth_token")}`,
                },
            });
            const presignedUrl = response.data.url;

            setUploadUrl(presignedUrl);
            console.log("🔗 Presigned URL:", presignedUrl);

            // שלב 2: העלאת הקובץ ל-S3
            console.log(file.type);

            await axios.put(presignedUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percent);
                },
            });
            const url = `${meeting?.teamId}/${file.name}`
          
            const fileMetadata = {
                MeetingId: Number(meetingId),
                // TeamId: meeting?.teamId,    
                FileUrl: url,
                IsTranscript: false
            };

            await axios.put("https://localhost:7214/api/Meeting/update-meeting-file", fileMetadata, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert("✅ הקובץ הועלה בהצלחה!");
        } catch (error: any) {
            console.error("❌ שגיאה בהעלאה:", error.response?.data || error.message);
            alert(`❌ שגיאה בהעלאה: ${error.response?.data?.message || "שגיאה לא ידועה"}`);
        }
        const response = await axios.get('https://localhost:7214/api/upload/download-url', {
            params: {
                fileName: `${meeting?.teamId}/${file.name}`,
            },
            headers: {
                "Authorization": `Bearer ${getCookie("auth_token")}`,
            },
        });
        console.log(response);

        setDownloadUrl(response.data.downloadUrl); // שמירת URL להורדה
    };

    // פונקציה להורדת הקובץ
    const downloadFileToComputer = async () => {
        if (!downloadUrl || !file) return;

        try {
            const fileResponse = await axios.get(downloadUrl, {
                responseType: "blob",
                onDownloadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    console.log(`📥 Download progress: ${percent}%`);
                },
            });

            // יצירת קישור זמני להורדה
            const blobUrl = window.URL.createObjectURL(new Blob([fileResponse.data]));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", file.name); // שם הקובץ המקורי
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("❌ שגיאה בהורדה:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>📤 העלה קובץ</button>
            {progress > 0 && <div>🔄 התקדמות: {progress}%</div>}
            {uploadUrl && <div>📂 קובץ הועלה ל-S3: <a href={uploadUrl} target="_blank" rel="noopener noreferrer">🔗 פתח</a></div>}
            {downloadUrl && <button onClick={downloadFileToComputer}>📥 הורד קובץ</button>}
        </div>
    );
};

export default FileUploader;






