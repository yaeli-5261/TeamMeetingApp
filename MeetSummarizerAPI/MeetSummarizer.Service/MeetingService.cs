using AutoMapper;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.IRepository;
using MeetSummarizer.Core.Services;
using MeetSummarizer.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Service
{
    public class MeetingService : IMeetingService
    {
        //private readonly IMeetingRepository _meetingRepository;
        //private readonly IMapper _mapper;
        private readonly IManagerRepository _managerRepository;
        private readonly IMapper _mapper;

        public MeetingService(IManagerRepository managerRepository, IMapper mapper)
        {
            _managerRepository = managerRepository;
            _mapper = mapper;
        }

        public async Task<List<MeetingDTO>> GetAllMeetings()
        {
            var meetings = await _managerRepository.meetingRepository.GetAllMeetingAsync();
            return _mapper.Map<List<MeetingDTO>>(meetings);
        }

        //שליפה לפי צוות
        public async Task<List<MeetingDTO>> GetMeetingsByTeamId(int teamId)
        {
           

            var meetings = await _managerRepository.meetingRepository.GetMeetingsByTeamIdAsync(teamId);
            return _mapper.Map<List<MeetingDTO>>(meetings);
        }

        public async Task<MeetingDTO> GetMeetingById(int id)
        {
            var meeting = await _managerRepository.meetingRepository.GetMeetingByIdAsync(id);
            return meeting != null ? _mapper.Map<MeetingDTO>(meeting) : null;
        }

        public async Task AddMeeting(Meeting meeting)
        {
            await _managerRepository.meetingRepository.AddMeetingAsync(meeting);
        }

        public async Task<MeetingDTO> UpdateMeeting(int id, MeetingPostDTO meetingDto)
        {
            var updatedMeeting = await _managerRepository.meetingRepository.UpdateMeetingAsync(id, _mapper.Map<Meeting>(meetingDto));
            return updatedMeeting != null ? _mapper.Map<MeetingDTO>(updatedMeeting) : null;
        }
        // לפי ID עדכון הקשור של הקובץ בפגישה
        public async Task<bool> UpdateMeetingFileLink(int meetingId, string fileUrl, bool isTranscript)
        {
            bool updated = await _managerRepository.meetingRepository.UpdateMeetingFileLinkAsync(meetingId, fileUrl, isTranscript);
            if (!updated) return false;

            await _managerRepository.SaveAsync(); // שמירת השינויים
            return true;
        }

        public async Task<bool> DeleteMeeting(int id)
        {
            return await _managerRepository.meetingRepository.DeleteMeetingAsync(id);
        }
    }
}
