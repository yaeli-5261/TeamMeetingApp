import { useState } from "react";
import axios from "axios";
import mammoth from "mammoth";

const FileViewer = ({ downloadUrl, fileName }: { downloadUrl: string; fileName: string }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [docxHtml, setDocxHtml] = useState<string | null>(null);

    const downloadAndShowFile = async () => {
        if (!downloadUrl) {
            console.error("❌ ה-URL לא מוגדר");
            return;
        }

        try {
            // בדוק אם ה-URL תקין
            const url = new URL(downloadUrl);  // יבדוק אם ה-URL תקין
            if (!url.protocol || !url.hostname) {
                console.error("❌ ה-URL לא תקין:", downloadUrl);
                return;
            }

            const fileResponse = await axios.get(downloadUrl, {
                responseType: "arraybuffer", // חשוב לשנות ל-arraybuffer כדי לקרוא את קובץ ה-DOCX
            });

            if (fileName.endsWith(".docx")) {
                // המרת DOCX ל-HTML בעזרת mammoth.js
                const { value } = await mammoth.convertToHtml({ arrayBuffer: fileResponse.data });
                setDocxHtml(value); // שים את ה-HTML בתוך state
            }

            const blobUrl = window.URL.createObjectURL(new Blob([fileResponse.data]));
            setFileUrl(blobUrl);
        } catch (error) {
            console.error("❌ שגיאה בהורדה:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <button
                onClick={downloadAndShowFile}
                style={{ padding: "10px", marginBottom: "10px", marginRight: "20px" }}
            >
                📂 הצג קובץ
            </button>

            {fileUrl && (
                <div
                    style={{
                        flex: 1,
                        maxWidth: "80vw",
                        height: "90vh",
                        overflow: "auto",
                        border: "1px solid #ccc",
                        padding: "10px",
                        boxSizing: "border-box",
                    }}
                >
                    <h3>📄 {fileName}</h3>
                    {fileName.endsWith(".docx") && docxHtml ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: docxHtml }}
                            style={{ width: "100%", height: "auto", overflow: "auto" }}
                        />
                    ) : fileName.endsWith(".pdf") ? (
                        <iframe
                            src={fileUrl}
                            width="100%"
                            height="100%"
                            title="File Preview"
                            style={{ border: "none" }}
                        />
                    ) : (
                        <img
                            src={fileUrl}
                            alt="Preview"
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "contain", // שיבטיח שהתמונה תתאים למסך
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default FileViewer;

