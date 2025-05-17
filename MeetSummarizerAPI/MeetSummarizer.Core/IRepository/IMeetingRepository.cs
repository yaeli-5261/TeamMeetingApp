using MeetSummarizer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.IRepository
{
    public interface IMeetingRepository
    {
        Task<List<Meeting>> GetAllMeetingAsync();
        Task<Meeting> GetMeetingByIdAsync(int id);

        //שליפה לפי צוות
        Task<List<Meeting>> GetMeetingsByTeamIdAsync(int teamId);

        Task AddMeetingAsync(Meeting meeting);
        Task<Meeting> UpdateMeetingAsync(int id, Meeting meeting);
        //עדכון קשור לקובץ
        Task<bool> UpdateMeetingFileLinkAsync(int meetingId, string fileUrl, bool isTranscript);
        Task<bool> DeleteMeetingAsync(int id);
    }
}

