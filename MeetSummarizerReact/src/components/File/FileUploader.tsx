"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import type { AppDispatch, RootState } from "../../store/store"
import { fetchMeetingsByTeam } from "../../store/meetingSlice"
import mammoth from "mammoth"

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
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)

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

  const handleUpload = async () => {
    if (!file || !meetingId) {
      setError("❌ יש לבחור קובץ ולהיות בתוך פגישה.")
      return
    }

    try {
      setIsUploading(true)
      setProgress(0)

      const response = await axios.get("https://localhost:7214/api/upload/presigned-url", {
        params: { fileName: `${meeting?.teamId}/${file.name}`, contentType: file.type },
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      const presignedUrl = response.data.url

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)))
        },
      })

      const fileMetadata = {
        MeetingId: Number(meetingId),
        FileUrl: `${meeting?.teamId}/${file.name}`,
        IsTranscript: false,
      }

      await axios.put("https://localhost:7214/api/Meeting/update-meeting-file", fileMetadata, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      const downloadResponse = await axios.get("https://localhost:7214/api/upload/download-url", {
        params: { fileName: `${meeting?.teamId}/${file.name}` },
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      setDownloadUrl(downloadResponse.data.downloadUrl)

      // Refresh meeting data to update the file link
      dispatch(fetchMeetingsByTeam({ teamId: meeting?.teamId || 0 }))

      setError(null)

      // Automatically show preview after upload
      handleViewFile()
    } catch (error: any) {
      setError(`❌ שגיאה בהעלאה: ${error.response?.data || error.message}`)
      console.error("❌ שגיאה בהעלאה:", error.response?.data || error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewFile = async () => {
    if (!downloadUrl) return

    try {
      setIsUploading(true)
      setError(null)

      const fileType = fileName.split(".").pop()?.toLowerCase() || ""

      const fileResponse = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          console.log(`Loading file: ${percent}%`)
        },
      })

      let content
      if (fileType === "docx") {
        try {
          const { value } = await mammoth.convertToHtml({ arrayBuffer: fileResponse.data })
          content = value
        } catch (docxError) {
          console.error("Error converting DOCX:", docxError)
          setError("❌ שגיאה בהמרת קובץ DOCX")
        }
      } else if (fileType === "txt") {
        try {
          const decoder = new TextDecoder("utf-8")
          content = decoder.decode(fileResponse.data)
        } catch (txtError) {
          console.error("Error decoding text file:", txtError)
        }
      }

      const blobUrl = window.URL.createObjectURL(new Blob([fileResponse.data], { type: getMimeType(fileType) }))

      setFilePreview({
        url: blobUrl,
        type: fileType,
        content: content,
      })

      setIsPreviewOpen(true)
    } catch (error) {
      console.error("❌ שגיאה בטעינת הקובץ:", error)
      setError("❌ שגיאה בטעינת הקובץ")
    } finally {
      setIsUploading(false)
    }
  }

  const downloadFileToComputer = async () => {
    if (!downloadUrl) return

    try {
      setIsDownloading(true)
      setDownloadProgress(0)
      setError(null)

      const fileResponse = await axios.get(downloadUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setDownloadProgress(percent)
          console.log(`📥 Download progress: ${percent}%`)
        },
      })

      const blobUrl = window.URL.createObjectURL(
        new Blob([fileResponse.data], { type: getMimeType(fileName.split(".").pop()?.toLowerCase() || "") }),
      )
      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      // Show success message
      setError("✅ הקובץ הורד בהצלחה")
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      console.error("❌ שגיאה בהורדה:", error)
      setError("❌ שגיאה בהורדת הקובץ")
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
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

  const closePreview = () => {
    setIsPreviewOpen(false)
  }

  const getMimeType = (extension: string): string => {
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls: "application/vnd.ms-excel",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ppt: "application/vnd.ms-powerpoint",
    }

    return mimeTypes[extension] || "application/octet-stream"
  }

  const renderFilePreview = () => {
    if (!filePreview.url) return null

    const fileType = filePreview.type

    if (fileType === "pdf") {
      return <iframe src={filePreview.url} width="100%" height="100%" title="PDF Preview" style={{ border: "none" }} />
    } else if (fileType === "docx" && filePreview.content) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: filePreview.content }}
          style={{ width: "100%", height: "auto", overflow: "auto", padding: "16px" }}
        />
      )
    } else if (fileType === "txt" && filePreview.content) {
      return (
        <pre
          style={{
            width: "100%",
            height: "auto",
            overflow: "auto",
            padding: "16px",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: "1.5",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          {filePreview.content}
        </pre>
      )
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
      return (
        <img
          src={filePreview.url || "/placeholder.svg"}
          alt={fileName}
          style={{
            maxWidth: "100%",
            maxHeight: "calc(100% - 40px)",
            objectFit: "contain",
            margin: "0 auto",
            display: "block",
          }}
        />
      )
    } else {
      return (
        <div className="generic-file-preview">
          <div className="file-icon">📄</div>
          <div className="file-name">{fileName}</div>
          <a href={filePreview.url} download={fileName} className="download-link">
            הורד את הקובץ לצפייה
          </a>
        </div>
      )
    }
  }

  return (
    <div className="file-uploader-container">
      {error && (
        <div className={`message-box ${error.startsWith("✅") ? "success-message" : "error-message"}`}>{error}</div>
      )}

      {!downloadUrl && !hasExistingFile ? (
        <div className="upload-section">
          <div className="file-input-container">
            <input type="file" onChange={handleFileChange} className="file-input" id="file-upload" />
            <label htmlFor="file-upload" className="file-label">
              {file ? file.name : "בחר קובץ"}
            </label>
          </div>

          <button onClick={handleUpload} disabled={!file || isUploading} className="upload-button">
            {isUploading ? `🔄 מעלה... ${progress}%` : "📤 העלה קובץ"}
          </button>

          {progress > 0 && progress < 100 && (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      ) : (
        <div className="file-preview-section">
          <div className="file-card">
            <div className="file-card-header">
              <div className="file-info">
                <div className="file-icon">{getFileIcon(fileName.split(".").pop()?.toLowerCase() || "")}</div>
                <div className="file-details">
                  <div className="file-name">{fileName}</div>
                  <div className="file-type">{getFileTypeLabel(fileName.split(".").pop()?.toLowerCase() || "")}</div>
                </div>
              </div>
              {!hasExistingFile && (
                <button onClick={resetFileUpload} className="remove-button" aria-label="הסר קובץ">
                  ❌
                </button>
              )}
            </div>
            <div className="file-card-actions">
              <button onClick={handleViewFile} disabled={isUploading} className="view-button">
                {isUploading ? "טוען..." : "👁️ צפה בקובץ"}
              </button>
              <button onClick={downloadFileToComputer} disabled={isDownloading} className="download-button">
                {isDownloading ? `📥 מוריד... ${downloadProgress}%` : "📥 הורד"}
              </button>
            </div>

            {isDownloading && downloadProgress > 0 && (
              <div className="download-progress-container">
                <div className="download-progress-bar" style={{ width: `${downloadProgress}%` }}></div>
              </div>
            )}
          </div>
        </div>
      )}

      {isPreviewOpen && filePreview.url && (
        <div className="file-preview-modal">
          <div className="file-preview-container">
            <div className="file-preview-header">
              <h3 className="file-preview-title">📄 {fileName}</h3>
              <button onClick={closePreview} className="close-button">
                ×
              </button>
            </div>
            <div className="file-preview-content">{renderFilePreview()}</div>
          </div>
        </div>
      )}

      <style>{`
        .file-uploader-container {
          padding: 16px;
          border-radius: 8px;
          background-color: #f9f9f9;
          margin-bottom: 20px;
          position: relative;
        }
        
        .error-message, .success-message {
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
        }
        
        .success-message {
          color: #2e7d32;
          background-color: #e8f5e9;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .upload-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .file-input-container {
          position: relative;
        }
        
        .file-input {
          position: absolute;
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          z-index: -1;
        }
        
        .file-label {
          display: inline-block;
          padding: 10px 16px;
          background-color: #e0e0e0;
          color: #333;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        
        .file-label:hover {
          background-color: #d5d5d5;
        }
        
        .upload-button {
          padding: 10px 16px;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        .upload-button:hover:not(:disabled) {
          background-color: #1976d2;
        }
        
        .upload-button:disabled {
          background-color: #bbdefb;
          cursor: not-allowed;
        }
        
        .progress-bar-container, .download-progress-container {
          width: 100%;
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .download-progress-container {
          margin: 0 16px 16px 16px;
        }
        
        .progress-bar, .download-progress-bar {
          height: 100%;
          background-color: #2196f3;
          transition: width 0.3s ease;
        }
        
        .file-preview-section {
          margin-top: 8px;
        }
        
        .file-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
        }
        
        .file-card-header {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .file-info {
          display: flex;
          align-items: center;
        }
        
        .file-icon {
          font-size: 24px;
          margin-right: 12px;
          color: #2196f3;
        }
        
        .file-details {
          display: flex;
          flex-direction: column;
        }
        
        .file-name {
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 2px;
        }
        
        .file-type {
          font-size: 12px;
          color: #757575;
        }
        
        .remove-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #757575;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        
        .remove-button:hover {
          background-color: #f5f5f5;
        }
        
        .file-card-actions {
          display: flex;
          padding: 12px 16px;
          gap: 8px;
        }
        
        .view-button, .download-button {
          flex: 1;
          padding: 8px 0;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        .view-button {
          background-color: #f5f5f5;
          color: #333;
        }
        
        .view-button:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
        
        .download-button {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        
        .download-button:hover:not(:disabled) {
          background-color: #bbdefb;
        }
        
        .view-button:disabled, .download-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* File preview modal styles */
        .file-preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        
        .file-preview-container {
          width: calc(100% - 250px);
          height: 100%;
          margin-right: 250px;
          background-color: white;
          display: flex;
          flex-direction: column;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
          .file-preview-container {
            width: 100%;
            margin-right: 0;
          }
        }
        
        .file-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background-color: white;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .file-preview-title {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #757575;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .close-button:hover {
          background-color: #f5f5f5;
        }
        
        .file-preview-content {
          flex: 1;
          background-color: white;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .generic-file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
          text-align: center;
        }
        
        .file-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        
        .download-link {
          margin-top: 16px;
          color: #2196f3;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 4px;
          background-color: #e3f2fd;
          transition: background-color 0.3s;
        }
        
        .download-link:hover {
          background-color: #bbdefb;
          text-decoration: underline;
        }
      `}</style>
    </div>
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

