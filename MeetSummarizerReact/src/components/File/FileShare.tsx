import { useState } from "react";
import axios from "axios";

interface FileShareProps {
  fileUrl: string;
  fileName: string;
}

const FileShare = ({ fileUrl, fileName }: FileShareProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    if (!email) {
      setMessage("❌ יש להכניס כתובת מייל תקינה!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("https://localhost:7214/api/files/send-email", {
        email,
        fileUrl,
        fileName,
      });

      setMessage("✅ הקובץ נשלח בהצלחה!");
    } catch (error) {
      console.error("❌ שגיאה בשליחה:", error);
      setMessage("❌ שגיאה בשליחת המייל. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="email"
        placeholder="הכנס כתובת מייל..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "8px",
          marginRight: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <button
        onClick={handleSendEmail}
        disabled={loading}
        style={{
          padding: "8px 12px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📧 שלח במייל
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileShare;
