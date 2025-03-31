"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import mammoth from "mammoth"

interface FileViewerProps {
  filePath: string
  fileName: string
}

const FileViewer: React.FC<FileViewerProps> = ({ filePath, fileName }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [docxHtml, setDocxHtml] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false)

  const fileType = fileName.split(".").pop()?.toLowerCase() || ""

  // Get download URL when component mounts
  useEffect(() => {
    if (filePath) {
      getDownloadUrl()
    }
  }, [filePath])

  // Get download URL from API
  const getDownloadUrl = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("https://localhost:7214/api/upload/download-url", {
        params: { fileName: filePath },
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })
      setDownloadUrl(response.data.downloadUrl)
      setIsLoading(false)
    } catch (error) {
      console.error("Error getting download URL:", error)
      setError("❌ שגיאה בקבלת קישור להורדה")
      setIsLoading(false)
    }
  }

  const downloadAndShowFile = async () => {
    if (!downloadUrl) {
      setError("❌ ה-URL לא מוגדר")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const fileResponse = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
      })

      if (fileType === "docx") {
        try {
          const { value } = await mammoth.convertToHtml({ arrayBuffer: fileResponse.data })
          setDocxHtml(value)
        } catch (docxError) {
          console.error("Error converting DOCX:", docxError)
          setError("❌ שגיאה בהמרת קובץ DOCX")
        }
      }

      const blobUrl = window.URL.createObjectURL(
        new Blob([fileResponse.data], {
          type: getMimeType(fileType),
        }),
      )

      setFileUrl(blobUrl)
      setIsViewerOpen(true)
    } catch (error) {
      console.error("❌ שגיאה בהורדה:", error)
      setError("❌ שגיאה בטעינת הקובץ")
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl)
      }
    }
  }, [fileUrl])

  const closeViewer = () => {
    setIsViewerOpen(false)
  }

  const downloadFile = async () => {
    if (!downloadUrl) {
      setError("❌ ה-URL לא מוגדר")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const fileResponse = await axios.get(downloadUrl, {
        responseType: "blob",
      })

      const blobUrl = window.URL.createObjectURL(new Blob([fileResponse.data], { type: getMimeType(fileType) }))

      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      setError("✅ הקובץ הורד בהצלחה")
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      console.error("❌ שגיאה בהורדה:", error)
      setError("❌ שגיאה בהורדת הקובץ")
    } finally {
      setIsLoading(false)
    }
  }

  const getMimeType = (extension: string): string => {
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
    }

    return mimeTypes[extension] || "application/octet-stream"
  }

  const renderFilePreview = () => {
    if (!fileUrl) return null

    if (fileType === "pdf") {
      return <iframe src={fileUrl} width="100%" height="100%" title="PDF Preview" style={{ border: "none" }} />
    } else if (fileType === "docx" && docxHtml) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: docxHtml }}
          style={{ width: "100%", height: "auto", overflow: "auto", padding: "16px" }}
        />
      )
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
      return (
        <img
          src={fileUrl || "/placeholder.svg"}
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
          <a href={fileUrl} download={fileName} className="download-link">
            הורד את הקובץ לצפייה
          </a>
        </div>
      )
    }
  }

  return (
    <div className="file-viewer-container">
      <div className="file-actions">
        <button onClick={downloadAndShowFile} disabled={isLoading || !downloadUrl} className="view-file-button">
          {isLoading ? "טוען..." : "👁️ הצג קובץ"}
        </button>
        <button onClick={downloadFile} disabled={isLoading || !downloadUrl} className="download-file-button">
          {isLoading ? "טוען..." : "📥 הורד קובץ"}
        </button>
      </div>

      {error && (
        <div className={`message-box ${error.startsWith("✅") ? "success-message" : "error-message"}`}>{error}</div>
      )}

      {isViewerOpen && fileUrl && (
        <div className="file-preview-modal">
          <div className="file-preview-container">
            <div className="file-preview-header">
              <h3 className="file-name">📄 {fileName}</h3>
              <button onClick={closeViewer} className="close-button">
                ×
              </button>
            </div>
            <div className="file-preview-content">{renderFilePreview()}</div>
          </div>
        </div>
      )}

      <style>{`
        .file-viewer-container {
          margin-top: 16px;
        }
        
        .file-actions {
          display: flex;
          gap: 8px;
        }
        
        .view-file-button, .download-file-button {
          padding: 10px 16px;
          background-color: #3f51b5;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }
        
        .view-file-button {
          background-color: #f5f5f5;
          color: #333;
        }
        
        .view-file-button:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
        
        .download-file-button {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        
        .download-file-button:hover:not(:disabled) {
          background-color: #bbdefb;
        }
        
        .view-file-button:disabled, .download-file-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .message-box {
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 12px;
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
        
        .file-preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        
        .file-preview-container {
          width: 100%;
          height: 100%;
          background-color: white;
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .file-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: white;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .file-name {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .close-button:hover {
          background-color: #f0f0f0;
        }
        
        .file-preview-content {
          flex: 1;
          background-color: white;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
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

// Helper function to get cookie value
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

export default FileViewer

