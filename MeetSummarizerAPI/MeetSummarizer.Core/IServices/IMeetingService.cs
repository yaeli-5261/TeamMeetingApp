using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.Services
{
    public interface IMeetingService
    {
        Task<List<MeetingDTO>> GetAllMeetings();
        Task<MeetingDTO> GetMeetingById(int id);

        //שליפה לפי צוות 
        Task<List<MeetingDTO>> GetMeetingsByTeamId(int teamId);


        Task AddMeeting(Meeting meeting);
        Task<MeetingDTO> UpdateMeeting(int id, MeetingPostDTO meetingDto);

        //עדכון קשוור
        Task<bool> UpdateMeetingFileLink(int meetingId, string fileUrl, bool isTranscript);

        Task<bool> DeleteMeeting(int id);
    }
}
