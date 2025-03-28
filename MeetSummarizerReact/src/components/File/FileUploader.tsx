import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import FileViewer from "./FileViewer"; // ייבוא הקומפוננטה
import { AppDispatch, RootState } from "../../store/store";
import { fetchMeetingsByTeam } from "../../store/meetingSlice";
import { getCookie } from "../login/SignIn";

export const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const { meetingId } = useParams<{ meetingId: string }>(); 
    const dispatch: AppDispatch = useDispatch();
    const meetings = useSelector((state: RootState) => state.meetings.list);
    const [meeting, setMeeting] = useState(meetings.find((m) => m.id === Number(meetingId)));

    useEffect(() => {
        dispatch(fetchMeetingsByTeam({ teamId: meeting?.teamId || 0 }));
        setMeeting(meetings.find((m) => m.id === Number(meetingId)));
    }, [meetingId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !meetingId) {
            alert("❌ יש לבחור קובץ ולהיות בתוך פגישה.");
            return;
        }

        try {
            const response = await axios.get('https://localhost:7214/api/upload/presigned-url', {
                params: { fileName: `${meeting?.teamId}/${file.name}`, contentType: file.type },
                headers: { "Authorization": `Bearer ${getCookie("auth_token")}` },
            });
            const presignedUrl = response.data.url;

            await axios.put(presignedUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: (progressEvent) => {
                    setProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)));
                },
            });

            const fileMetadata = {
                MeetingId: Number(meetingId),
                FileUrl: `${meeting?.teamId}/${file.name}`,
                IsTranscript: false
            };

            await axios.put("https://localhost:7214/api/Meeting/update-meeting-file", fileMetadata, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            alert("✅ הקובץ הועלה בהצלחה!");

            const downloadResponse = await axios.get('https://localhost:7214/api/upload/download-url', {
                params: { fileName: `${meeting?.teamId}/${file.name}` },
                headers: { "Authorization": `Bearer ${getCookie("auth_token")}` },
            });

            setDownloadUrl(downloadResponse.data.downloadUrl);
        } catch (error: any) {
            console.error("❌ שגיאה בהעלאה:", error.response?.data || error.message);
        }
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
            
            {downloadUrl && (
                <div>
                    <FileViewer downloadUrl={downloadUrl} fileName={file?.name || "file"} />
                    <button onClick={downloadFileToComputer}>📥 הורד קובץ</button>
                </div>
            )}
        </div>
    );
};

export default FileUploader;

