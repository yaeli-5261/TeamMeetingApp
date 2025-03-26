import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useParams } from "react-router-dom";

export const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploadUrl, setUploadUrl] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    // const user = useSelector((state: RootState) => state.Auth.user);
    const { meetingId } = useParams<{ meetingId: string }>(); // קבלת ה-meetingId מה-URL

    const meeting = useSelector((state: RootState) => state.meetings.list)
        .find((meeting) => meeting.id === Number(meetingId));
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }   
    };

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
            // שלב 1: בקשת Presigned URL מהשרת
            const response = await axios.get('https://localhost:7214/api/upload/presigned-url', {
                params: { fileName: file.name },
                
            });
            // https://meet-summarizer-files.s3.eu-north-1.amazonaws.com/%D7%92%D7%99%D7%91%D7%95%D7%99+%D7%9C%D7%A8%D7%A9%D7%99%D7%9E%D7%AA+%D7%A4%D7%92%D7%99%D7%A9%D7%95%D7%AA.docx
            const presignedUrl = response.data.url;

            setUploadUrl(presignedUrl);
            console.log("🔗 Presigned URL:", presignedUrl);

            // שלב 2: העלאת הקובץ ל-S3
            await axios.put(presignedUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percent);
                },
            });
            const url = `https://meet-summarizer-files.s3.eu-north-1.amazonaws.com/${file.name}`;

            // שלב 3: קבלת URL להורדה מהשרת
            // const res = await axios.get('https://localhost:7214/api/upload/download-url', {
            //     params: { fileName: file.name }
            // });

            // setDownloadUrl(res.data.downloadUrl); // שמירת URL להורדה

            const fileMetadata = {
                MeetingId: Number(meetingId),
                FileUrl: url,
                IsTranscript: false
            };

            console.log("📤 נתונים שנשלחים ל-API:", fileMetadata);
        
                await axios.put("https://localhost:7214/api/Meeting/update-meeting-file", fileMetadata, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                alert("✅ הקובץ הועלה בהצלחה!");
            } catch (error: any) {
                console.error("❌ שגיאה בהעלאה:", error.response?.data || error.message);
                alert(`❌ שגיאה בהעלאה: ${error.response?.data?.message || "שגיאה לא ידועה"}`);
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
            {uploadUrl && <div>📂 קובץ הועלה ל-S3: <a href={uploadUrl} target="_blank" rel="noopener noreferrer">🔗 פתח</a></div>}
            {downloadUrl && <button onClick={downloadFileToComputer}>📥 הורד קובץ</button>}
        </div>
    );
};

export default FileUploader;






