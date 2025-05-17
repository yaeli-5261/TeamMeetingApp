// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import mammoth from 'mammoth';

// type Props = {
//   filePath: string; // לדוגמה: summaries/meeting_123_summary.docx
//   onClose: () => void;
// };

// const TranscriptFileViewer: React.FC<Props> = ({ filePath, onClose }) => {
//   const [fileUrl, setFileUrl] = useState<string | null>(null);
//   const [htmlContent, setHtmlContent] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const getDownloadUrl = async (fileName: string): Promise<string> => {
//     const response = await axios.get(`https://localhost:7214/api/upload/download-url`, {
//       params: { fileName },
//     });
//     return response.data;
//   };

//   const downloadAndShowFile = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const url = await getDownloadUrl(filePath);
//       const response = await axios.get(url, { responseType: 'blob' });
//       const file = response.data;
//       const fileType = file.type;

//       if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
//         const blobUrl = URL.createObjectURL(file);
//         setFileUrl(blobUrl);
//       } else if (
//         filePath.endsWith('.docx') ||
//         fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//       ) {
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.convertToHtml({ arrayBuffer });
//         setHtmlContent(result.value);
//       } else {
//         const text = await file.text();
//         setHtmlContent(`<pre>${text}</pre>`);
//       }
//     } catch (err) {
//       console.error(err);
//       setError('הייתה שגיאה בעת הצגת הקובץ.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadFile = async () => {
//     try {
//       const url = await getDownloadUrl(filePath);
//       const response = await axios.get(url, { responseType: 'blob' });
//       const blobUrl = URL.createObjectURL(response.data);
//       const a = document.createElement('a');
//       a.href = blobUrl;
//       a.download = filePath.split('/').pop() || 'downloaded_file';
//       a.click();
//       URL.revokeObjectURL(blobUrl);
//     } catch (err) {
//       console.error(err);
//       setError('הייתה שגיאה בהורדת הקובץ.');
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (fileUrl) {
//         URL.revokeObjectURL(fileUrl);
//       }
//     };
//   }, [fileUrl]);

//   return (
//     <div className="p-4 border rounded shadow bg-white">
//       <h2 className="text-xl font-semibold mb-2">קובץ סיכום AI</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       {loading && <p>טוען קובץ...</p>}

//       <div className="flex gap-2 mb-3">
//         <button onClick={downloadAndShowFile} className="bg-blue-500 text-white px-4 py-2 rounded">
//           הצג קובץ
//         </button>
//         <button onClick={downloadFile} className="bg-green-500 text-white px-4 py-2 rounded">
//           הורד קובץ
//         </button>
//         <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
//           סגור
//         </button>
//       </div>

//       {fileUrl && (
//         <iframe src={fileUrl} className="w-full h-96 border" title="File Preview" />
//       )}

//       {htmlContent && (
//         <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
//       )}
//     </div>
//   );
// };

// export default TranscriptFileViewer;
