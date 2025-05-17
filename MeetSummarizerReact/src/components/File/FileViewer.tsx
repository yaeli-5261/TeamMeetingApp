"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Box, Button, Typography, Alert, CircularProgress, Dialog } from "@mui/material"
import { Visibility, Download, Close } from "@mui/icons-material"
import "./fileViewer.css"

interface FileViewerProps {
  filePath: string
  fileName: string
  isAiGenerated?: boolean
}

const FileViewer = ({ filePath, fileName, isAiGenerated = false }: FileViewerProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [docxHtml, setDocxHtml] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false)

  const fileType = fileName.split(".").pop()?.toLowerCase() || ""

  // Get download URL when component mounts or filePath changes
  useEffect(() => {
    if (filePath) {
      getDownloadUrl()
    }
  }, [filePath])

  // Get download URL from API or use direct S3 URL for AI-generated files
  const getDownloadUrl = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // For AI-generated files that already have a full URL
      if (isAiGenerated && filePath) {
        console.log("Original AI file path:", filePath)

        // Handle S3 URL format - could be with or without https://
        const fullUrl = filePath.includes("https://") ? filePath : `https://${filePath}`
        console.log("Using direct S3 URL for AI file:", fullUrl)

        setDownloadUrl(fullUrl)
        setIsLoading(false)
        return
      }

      // For regular files, get the download URL from the API
      if (!filePath) {
        setError("נתיב קובץ חסר")
        setIsLoading(false)
        return
      }

      const response = await axios.get("https://localhost:7214/api/upload/download-url", {
        params: { fileName: filePath },
        headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
      })

      console.log("Download URL from API:", response.data.downloadUrl)
      setDownloadUrl(response.data.downloadUrl)
      setIsLoading(false)
    } catch (error) {
      console.error("Error getting download URL:", error)
      setError("שגיאה בקבלת קישור להורדה")
      setIsLoading(false)
    }
  }

  const downloadAndShowFile = async () => {
    if (!downloadUrl) {
      setError("כתובת URL לא מוגדרת")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log("Downloading file for preview from:", downloadUrl)

      try {
        const fileResponse = await axios.get(downloadUrl, {
          responseType: "arraybuffer",
          timeout: 30000,
        })

        if (fileType === "docx") {
          try {
            const mammoth = await import("mammoth")
            const { value } = await mammoth.convertToHtml({ arrayBuffer: fileResponse.data })
            setDocxHtml(value)
          } catch (docxError) {
            console.error("Error converting DOCX:", docxError)
            setError("שגיאה בהמרת קובץ DOCX")
          }
        }

        const blobUrl = window.URL.createObjectURL(
          new Blob([fileResponse.data], {
            type: getMimeType(fileType),
          }),
        )

        setFileUrl(blobUrl)
        setIsViewerOpen(true)
      } catch (error: any) {
        // If we get a 403 Forbidden error for AI-generated files
        if (error.response && error.response.status === 403 && isAiGenerated) {
          console.log("S3 access forbidden, trying to get a new presigned URL")

          // Extract the file key from the S3 URL using a more robust method
          let fileKey = ""

          // Handle different S3 URL formats
          if (filePath.includes("s3.amazonaws.com")) {
            // Format: https://bucket-name.s3.amazonaws.com/path/to/file.ext
            const urlParts = filePath.split("s3.amazonaws.com/")
            if (urlParts.length > 1) {
              fileKey = urlParts[1] // This gets everything after s3.amazonaws.com/
              console.log("Extracted file key from S3 URL:", fileKey)
            }
          } else if (filePath.includes("/")) {
            // If it's just a relative path or doesn't contain the domain
            fileKey = filePath
            console.log("Using file path as key:", fileKey)
          } else {
            throw new Error("Invalid S3 URL format")
          }

          if (!fileKey) {
            throw new Error("Could not extract file key from S3 URL")
          }

          // Get a new presigned URL for the file
          const presignedResponse = await axios.get("https://localhost:7214/api/upload/download-url", {
            params: { fileName: fileKey },
            headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
          })

          const newUrl = presignedResponse.data.downloadUrl
          console.log("Got new presigned URL:", newUrl)

          // Try again with the new URL
          const fileResponse = await axios.get(newUrl, {
            responseType: "arraybuffer",
            timeout: 30000,
          })

          const blobUrl = window.URL.createObjectURL(
            new Blob([fileResponse.data], {
              type: getMimeType(fileType),
            }),
          )

          setFileUrl(blobUrl)
          setIsViewerOpen(true)
        } else {
          throw error
        }
      }
    } catch (error: any) {
      console.error("Error downloading for preview:", error)
      setError(`שגיאה בטעינת הקובץ: ${error.message || "Unknown error"}`)
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
      setError("כתובת URL לא מוגדרת")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log("Downloading file from:", downloadUrl)

      try {
        const fileResponse = await axios.get(downloadUrl, {
          responseType: "blob",
          timeout: 30000,
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
      } catch (error: any) {
        // If we get a 403 Forbidden error for AI-generated files
        if (error.response && error.response.status === 403 && isAiGenerated) {
          console.log("S3 access forbidden, trying to get a new presigned URL")

          // Extract the file key from the S3 URL using a more robust method
          let fileKey = ""

          // Handle different S3 URL formats
          if (filePath.includes("s3.amazonaws.com")) {
            // Format: https://bucket-name.s3.amazonaws.com/path/to/file.ext
            const urlParts = filePath.split("s3.amazonaws.com/")
            if (urlParts.length > 1) {
              fileKey = urlParts[1] // This gets everything after s3.amazonaws.com/
              console.log("Extracted file key from S3 URL:", fileKey)
            }
          } else if (filePath.includes("/")) {
            // If it's just a relative path or doesn't contain the domain
            fileKey = filePath
            console.log("Using file path as key:", fileKey)
          } else {
            throw new Error("Invalid S3 URL format")
          }

          if (!fileKey) {
            throw new Error("Could not extract file key from S3 URL")
          }

          // Get a new presigned URL for the file
          const presignedResponse = await axios.get("https://localhost:7214/api/upload/download-url", {
            params: { fileName: fileKey },
            headers: { Authorization: `Bearer ${getCookie("auth_token")}` },
          })

          const newUrl = presignedResponse.data.downloadUrl
          console.log("Got new presigned URL:", newUrl)

          // Try again with the new URL
          const fileResponse = await axios.get(newUrl, {
            responseType: "blob",
            timeout: 30000,
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
        } else {
          throw error
        }
      }
    } catch (error: any) {
      console.error("Error downloading file:", error)
      setError(`שגיאה בהורדת הקובץ: ${error.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
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
            הורד לצפייה
          </a>
        </div>
      )
    }
  }

  return (
    <Box className="file-viewer-container" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
      <Button
        onClick={downloadAndShowFile}
        disabled={isLoading || !downloadUrl}
        startIcon={isLoading ? <CircularProgress size={20} /> : <Visibility />}
        variant="outlined"
        className="view-file-button"
        sx={{
          flex: { xs: "1 1 100%", sm: "1 1 50%" },
          borderColor: "#10a37f",
          color: "#10a37f",
          "&:hover": { borderColor: "#0e8a6c", bgcolor: "rgba(16, 163, 127, 0.04)" },
        }}
      >
        {isLoading ? "טוען..." : "צפה בקובץ"}
      </Button>
      <Button
        onClick={downloadFile}
        disabled={isLoading || !downloadUrl}
        startIcon={isLoading ? <CircularProgress size={20} /> : <Download />}
        variant="contained"
        className="download-file-button"
        sx={{
          flex: { xs: "1 1 100%", sm: "1 1 50%" },
          bgcolor: "#10a37f",
          "&:hover": { bgcolor: "#0e8a6c" },
        }}
      >
        {isLoading ? "טוען..." : "הורד קובץ"}
      </Button>

      {error && (
        <Alert
          severity={error.startsWith("✅") ? "success" : "error"}
          className="message-box"
          sx={{ width: "100%", mt: 1 }}
        >
          {error}
        </Alert>
      )}

      {/* Use Dialog instead of a custom modal to ensure it's above the sidebar */}
      <Dialog
        open={isViewerOpen}
        onClose={closeViewer}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            height: "90vh",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          className="file-preview-header"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" className="file-name">
            📄 {fileName}
          </Typography>
          <Button onClick={closeViewer} className="close-button" startIcon={<Close />} variant="text">
            סגור
          </Button>
        </Box>
        <Box className="file-preview-content" sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {renderFilePreview()}
        </Box>
      </Dialog>
    </Box>
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
