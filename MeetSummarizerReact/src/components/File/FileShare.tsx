// import { useState } from "react";
// import axios from "axios";

// interface FileShareProps {
//   fileUrl: string;
//   fileName: string;
// }

// const FileShare = ({ fileUrl, fileName }: FileShareProps) => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSendEmail = async () => {
//     if (!email) {
//       setMessage("❌ יש להכניס כתובת מייל תקינה!");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       await axios.post("https://localhost:7214/api/files/send-email", {
//         email,
//         fileUrl,
//         fileName,
//       });

//       setMessage("✅ הקובץ נשלח בהצלחה!");
//     } catch (error) {
//       console.error("❌ שגיאה בשליחה:", error);
//       setMessage("❌ שגיאה בשליחת המייל. נסה שוב.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ marginTop: "10px" }}>
//       <input
//         type="email"
//         placeholder="הכנס כתובת מייל..."
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         style={{
//           padding: "8px",
//           marginRight: "10px",
//           border: "1px solid #ccc",
//           borderRadius: "5px",
//         }}
//       />
//       <button
//         onClick={handleSendEmail}
//         disabled={loading}
//         style={{
//           padding: "8px 12px",
//           backgroundColor: loading ? "#ccc" : "#007bff",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         📧 שלח במייל
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default FileShare;
















"use client"

import { useState } from "react"
import axios from "axios"
import { Box, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"

interface FileShareProps {
  fileUrl: string
  fileName: string
}

const FileShare = ({ fileUrl, fileName }: FileShareProps) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleSendEmail = async () => {
    if (!email) {
      setMessage({
        text: "Please enter a valid email address!",
        type: "error",
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await axios.post("https://localhost:7214/api/files/send-email", {
        email,
        fileUrl,
        fileName,
      })

      setMessage({
        text: "File sent successfully!",
        type: "success",
      })
      setEmail("")
    } catch (error) {
      console.error("Error sending:", error)
      setMessage({
        text: "Error sending the email. Please try again.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mt: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#f9f9f9" }}>
      <Typography variant="subtitle2" fontWeight={500} gutterBottom>
        Share via Email
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          type="email"
          placeholder="Enter email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button
          onClick={handleSendEmail}
          disabled={loading || !email}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{
            bgcolor: "#10a37f",
            "&:hover": { bgcolor: "#0e8a6c" },
            textTransform: "none",
            minWidth: { xs: "100%", sm: "120px" },
          }}
        >
          {loading ? "Sending..." : "Send Email"}
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mt: 2, animation: "fadeIn 0.3s ease-in-out" }}>
          {message.text}
        </Alert>
      )}
    </Box>
  )
}

export default FileShare
