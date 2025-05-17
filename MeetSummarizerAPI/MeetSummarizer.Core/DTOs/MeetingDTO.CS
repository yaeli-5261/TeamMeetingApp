using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.DTOs
{
    public class MeetingDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int TeamId { get; set; }
        public string LinkTranscriptFile { get; set; }
        public string LinkOrinignFile { get; set; }
    }

    public class MeetingPostDTO
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int TeamId { get; set; }
        public string LinkTranscriptFile { get; set; }
        public string LinkOrinignFile { get; set; }
    }
    // מחלקה לעבודה עם הנתונים בבקשה
    public class UpdateMeetingFileRequest
    {
        public int MeetingId { get; set; }
        public string FileUrl { get; set; }
        public bool IsTranscript { get; set; } // אם זה true זה יעדכן את קובץ התמלול, אחרת את הקובץ המקורי
    }


    public class UpdateMeetingFileDTO
    {
        public string FileUrl { get; set; }
    }
}
