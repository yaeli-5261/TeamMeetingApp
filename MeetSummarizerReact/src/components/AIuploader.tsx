// import React, { useState, ChangeEvent } from 'react';

// const AIUploader: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [summary, setSummary] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("אנא בחרי קובץ קודם");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:5000/uploads", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Team-ID": 
//         },
//       });

//       const data = await response.json();

//       if (data.error) {
//         alert("שגיאה: " + data.error);
//       } else {
//         setSummary(data.summary);
//       }
//     } catch (err) {
//       alert("אירעה שגיאה בשליחה לשרת");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ direction: 'rtl', padding: '2rem' }}>
//       <h2>העלאת קובץ ל-AI</h2>
//       <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
//       <br /><br />
//       <button onClick={handleUpload} disabled={loading}>
//         {loading ? "מעבד..." : "שלח ל-AI"}
//       </button>

//       {summary && (
//         <div style={{ marginTop: '2rem' }}>
//           <h3>✨ סיכום AI:</h3>
//           <pre style={{ background: '#f0f0f0', padding: '1rem' }}>{summary}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIUploader;






import React, { useState, ChangeEvent, useEffect } from 'react';
import { getCookie } from "../services/meetingService"; // אם ה-TeamID בקוקי

const AIUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [teamId, setTeamId] = useState<number | null>(null);

  useEffect(() => {
    // שולפים את ה-TeamID מקוקי או מקום אחר שבו מאוחסן
    const userData = sessionStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (user) {
      setTeamId(user.teamId); // מניח שה-TeamId נמצא בתוך פרטי המשתמש
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !teamId) {
      alert("אנא בחרי קובץ קודם וודא שה-TeamID זמין");
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch(`http://localhost:5000/uploads?team_id=${teamId}`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.error) {
        alert("שגיאה: " + data.error);
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      alert("אירעה שגיאה בשליחה לשרת");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ direction: 'rtl', padding: '2rem' }}>
      <h2>העלאת קובץ ל-AI</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "מעבד..." : "שלח ל-AI"}
      </button>

      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h3>✨ סיכום AI:</h3>
          <pre style={{ background: '#f0f0f0', padding: '1rem' }}>{summary}</pre>
        </div>
      )}
    </div>
  );
};

export default AIUploader;
