"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import type { AppDispatch, RootState } from "../../store/store"
import { fetchMeetingsByTeam } from "../../store/meetingSlice"
import { Box, Button, Typography, Paper, CircularProgress, Alert, Divider, Chip } from "@mui/material"
import { CloudUpload, Delete } from "@mui/icons-material"
import "./fileUploader.css"
import FileShare from "./FileShare"
import FileViewer from "./FileViewer"

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<{
    url: string | null
    type: string
    content?: string
  }>({ url: null, type: "" })
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [aiDownloadUrl, setAiDownloadUrl] = useState<string | null>(null)
  const [aiProcessingStatus, setAiProcessingStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const { meetingId } = useParams<{ meetingId: string }>()
  const dispatch: AppDispatch = useDispatch()
  const meetings = useSelector((state: RootState) => state.meetings.list)
  const [meeting, setMeeting] = useState(meetings.find((m) => m.id === Number(meetingId)))

  // Check if meeting already has a file
  const hasExistingFile = meeting?.linkOrinignFile ? true : false
  const fileName = file?.name || meeting?.linkOrinignFile?.split("/").pop() || "קובץ"

  useEffect(() => {
    if (meetingId && (!meeting || meeting.id !== Number(meetingId))) {
      dispatch(fetchMeetingsByTeam({ teamId: meeting?.teamId || 0 }))
      const foundMeeting = meetings.find((m) => m.id === Number(meetingId))
      setMeeting(foundMeeting)

      // If meeting has a file URL, set it as the download URL
      if (foundMeeting?.linkOrinignFile) {
        setDownloadUrl(foundMeeting.linkOrinignFile)
      }

      // If meeting has an AI file URL, set it
      if (foundMeeting?.linkTranscriptFile) {
        setAiDownloadUrl(foundMeeting.linkTranscriptFile)
        setAiProcessingStatus("success")
      }
    }
  }, [meetingId, meetings, dispatch, meeting])

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (filePreview.url) {
        window.URL.revokeObjectURL(filePreview.url)
      }
    }
  }, [filePreview.url])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSummarize = async (fileUrl: string) => {
    const token = getCookie("auth_token")

    setIsProcessing(true)
    setAiProcessingStatus("processing")

    try {
      console.log("Sending file for AI processing:", fileUrl)

      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ file_url: fileUrl }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Processing failed: ${errorText}`)
      }

      const result = await response.json()
      console.log("Generated file URL from AI:", result.s3_url)

      // Make sure we have a valid S3 URL
      let s3Url = result.s3_url || ""

      // Check if the URL is properly formatted
      if (s3Url && !s3Url.startsWith("https://")) {
        console.warn("S3 URL doesn't start with https://, adding prefix")
        s3Url = `https://${s3Url}`
      }

      console.log("Storing AI URL in database:", s3Url)

      const fileMetadata = {
        MeetingId: Number(meetingId),
        FileUrl: s3Url,
        IsTranscript: true,
      }

      await axios.put("https://localhost:7214/api/Meeting/update-meeting-file", fileMetadata, {
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      setAiDownloadUrl(s3Url)
      setAiProcessingStatus("success")
      console.log("Summary file linked to meeting successfully:", fileMetadata)

      // Refresh meeting data to update the file link
      dispatch(fetchMeetingsByTeam({ teamId: meeting?.teamId || 0 }))
    } catch (error: any) {
      console.error("Error processing file:", error)
      setError(`שגיאה בעיבוד הקובץ: ${error.message || "Unknown error"}`)
      setAiProcessingStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !meetingId) {
      setError("יש לבחור קובץ ולהיות בתוך פגישה.")
      return
    }

    try {
      setIsUploading(true)
      setProgress(0)

      // Get presigned URL from your API
      const response = await axios.get("https://localhost:7214/api/upload/presigned-url", {
        params: {
          fileName: `${meeting?.teamId}/${file.name}`,
          contentType: file.type,
        },
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      const presignedUrl = response.data.url
      console.log("Got presigned URL for upload:", presignedUrl)

      // Upload file directly to S3 using the presigned URL
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)))
        },
      })

      // Update meeting with file metadata
      const fileMetadata = {
        MeetingId: Number(meetingId),
        FileUrl: `${meeting?.teamId}/${file.name}`,
        IsTranscript: false,
      }

      await axios.put("https://localhost:7214/api/Meeting/update-meeting-file", fileMetadata, {
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      // Get download URL for the uploaded file
      const downloadResponse = await axios.get("https://localhost:7214/api/upload/download-url", {
        params: { fileName: `${meeting?.teamId}/${file.name}` },
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      setDownloadUrl(downloadResponse.data.downloadUrl)
      console.log("File URL for summarization:", downloadResponse.data.downloadUrl)

      // Process with AI
      await handleSummarize(downloadResponse.data.downloadUrl)

      // Refresh meeting data to update the file link
      dispatch(fetchMeetingsByTeam({ teamId: meeting?.teamId || 0 }))

      setError(null)
    } catch (error: any) {
      setError(`שגיאה בהעלאה: ${error.response?.data || error.message}`)
      console.error("שגיאה בהעלאה:", error.response?.data || error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const resetFileUpload = () => {
    setFile(null)
    setProgress(0)
    setError(null)
    setDownloadUrl(null)

    // Clean up any blob URLs
    if (filePreview.url) {
      window.URL.revokeObjectURL(filePreview.url)
    }

    setFilePreview({ url: null, type: "" })
    setIsPreviewOpen(false)
  }

  return (
    <Paper elevation={0} className="file-uploader-container" sx={{ p: 3, mb: 4 }}>
      {error && (
        <Alert severity={error.startsWith("✅") ? "success" : "error"} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!downloadUrl && !hasExistingFile ? (
        <Box className="upload-section">
          <Box
            className="file-drop-area"
            sx={{
              border: "2px dashed #e0e0e0",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#10a37f" },
            }}
          >
            <input type="file" onChange={handleFileChange} className="file-input" id="file-upload" />
            <label htmlFor="file-upload" className="file-drop-label">
              <CloudUpload sx={{ fontSize: 40, mb: 1, color: "#10a37f" }} />
              <Typography variant="body1" fontWeight={500}>
                {file ? file.name : "גרור ושחרר או לחץ לבחירת קובץ"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                פורמטים נתמכים: PDF, DOCX, TXT
              </Typography>
            </label>
          </Box>

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            variant="contained"
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
            sx={{
              bgcolor: "#10a37f",
              "&:hover": { bgcolor: "#0e8a6c" },
              mt: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {isUploading ? `מעלה... ${progress}%` : "העלה קובץ"}
          </Button>

          {progress > 0 && progress < 100 && (
            <Box
              className="progress-container"
              sx={{ mt: 2, height: 8, bgcolor: "#f0f0f0", borderRadius: 1, overflow: "hidden" }}
            >
              <Box
                className="progress-bar"
                sx={{ height: "100%", bgcolor: "#10a37f" }}
                style={{ width: `${progress}%` }}
              ></Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Box className="file-info-card" sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2 }}>
            <Box
              className="file-info-header"
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box className="file-icon" sx={{ fontSize: 24, mr: 1 }}>
                  {getFileIcon(fileName.split(".").pop()?.toLowerCase() || "")}
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {fileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getFileTypeLabel(fileName.split(".").pop()?.toLowerCase() || "")}
                  </Typography>
                </Box>
              </Box>

              {!hasExistingFile && (
                <Button
                  onClick={resetFileUpload}
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  sx={{ textTransform: "none" }}
                >
                  הסר
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Original File Viewer */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
                קובץ מקורי
              </Typography>
              <FileViewer filePath={meeting?.linkOrinignFile || ""} fileName={fileName} isAiGenerated={false} />
            </Box>
          </Box>

          {/* AI Processing Status */}
          <Box sx={{ mt: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={500}>
                סטטוס סיכום AI
              </Typography>
              <Chip
                label={
                  aiProcessingStatus === "idle"
                    ? "לא התחיל"
                    : aiProcessingStatus === "processing"
                      ? "מעבד"
                      : aiProcessingStatus === "success"
                        ? "הושלם"
                        : "נכשל"
                }
                color={
                  aiProcessingStatus === "success"
                    ? "success"
                    : aiProcessingStatus === "error"
                      ? "error"
                      : aiProcessingStatus === "processing"
                        ? "primary"
                        : "default"
                }
                size="small"
              />
            </Box>

            {aiProcessingStatus === "processing" && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">מייצר סיכום AI, אנא המתן...</Typography>
              </Box>
            )}

            {aiProcessingStatus === "success" && aiDownloadUrl && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  סיכום AI מוכן לצפייה והורדה
                </Typography>
                <FileViewer
                  filePath={aiDownloadUrl}
                  fileName={`AI_Summary_${fileName.split(".")[0]}.pdf`}
                  isAiGenerated={true}
                />
              </Box>
            )}

            {aiProcessingStatus === "error" && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                אירעה שגיאה בייצור סיכום ה-AI. אנא נסה שוב.
              </Typography>
            )}
          </Box>

          {/* File Sharing */}
          <FileShare fileUrl={downloadUrl || ""} fileName={fileName} />
        </Box>
      )}
    </Paper>
  )
}

// Helper functions
function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ")
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=")
    if (key === name) {
      return decodeURIComponent(value)
    }
  }
  return null
}

function getFileIcon(fileType: string): string {
  const icons: Record<string, string> = {
    pdf: "📑",
    docx: "📝",
    doc: "📝",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    txt: "📄",
    csv: "📊",
    xlsx: "📊",
    xls: "📊",
    pptx: "📊",
    ppt: "📊",
  }

  return icons[fileType] || "📄"
}

function getFileTypeLabel(fileType: string): string {
  const labels: Record<string, string> = {
    pdf: "מסמך PDF",
    docx: "מסמך Word",
    doc: "מסמך Word",
    jpg: "תמונה",
    jpeg: "תמונה",
    png: "תמונה",
    gif: "תמונה",
    txt: "קובץ טקסט",
    csv: "גיליון נתונים",
    xlsx: "גיליון Excel",
    xls: "גיליון Excel",
    pptx: "מצגת PowerPoint",
    ppt: "מצגת PowerPoint",
  }

  return labels[fileType] || "קובץ"
}

export default FileUploader
