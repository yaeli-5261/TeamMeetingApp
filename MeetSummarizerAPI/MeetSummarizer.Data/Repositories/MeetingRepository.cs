using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Data.Repositories
{
    public class MeetingRepository : IMeetingRepository
    {
        private readonly DataContext _context;

        public MeetingRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Meeting>> GetAllMeetingAsync()
        {
            return await _context.Meetings.ToListAsync();
        }

        //שליפה לפי צוות
        public async Task<List<Meeting>> GetMeetingsByTeamIdAsync(int teamId)
        {
            return await _context.Meetings
                                 .Where(m => m.TeamId == teamId)
                                 .ToListAsync();
        }


        public async Task<Meeting> GetMeetingByIdAsync(int id)
        {
            return await _context.Meetings.FindAsync(id);
        }
   
        public async Task AddMeetingAsync(Meeting meeting)
        {
            await _context.Meetings.AddAsync(meeting);
            await _context.SaveChangesAsync();
        }

        public async Task<Meeting> UpdateMeetingAsync(int id, Meeting meeting)
        {
            var meetingToUpdate = await GetMeetingByIdAsync(id);
            if (meetingToUpdate == null)
                return null;

            meetingToUpdate.Name = meeting.Name;
            meetingToUpdate.Date = meeting.Date;
            meetingToUpdate.TeamId = meeting.TeamId;
            meetingToUpdate.LinkTranscriptFile = meeting.LinkTranscriptFile;
            meetingToUpdate.LinkOrinignFile= meeting.LinkOrinignFile;

            await _context.SaveChangesAsync();
            return meetingToUpdate;
        }
        //עדכון קשור
        public async Task<bool> UpdateMeetingFileLinkAsync(int meetingId, string fileUrl, bool isTranscript)
        {
            var meeting = await GetMeetingByIdAsync(meetingId);
            if (meeting == null) return false;
       
            if (isTranscript)
                meeting.LinkTranscriptFile = fileUrl; // עדכון קישור לקובץ תמלול
            else
                meeting.LinkOrinignFile = fileUrl; // עדכון קישור לקובץ המקורי
            //todo:mabye delete it
            //_context.Meetings.Update(meeting);
            await _context.SaveChangesAsync();
            return true;
        }



        public async Task<bool> DeleteMeetingAsync(int id)
        {
            var meeting = await GetMeetingByIdAsync(id);
            if (meeting == null)
                return false;

            _context.Meetings.Remove(meeting);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
