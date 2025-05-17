using AutoMapper;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace MeetSummarizer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class MeetingController : ControllerBase
    {
        private readonly IMeetingService _meetingService;
        private readonly IMapper _mapper;

        public MeetingController(IMeetingService meetingService, IMapper mapper)
        {
            _meetingService = meetingService;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Policy ="Admin")]
        public async Task<ActionResult<List<MeetingDTO>>> GetAll()
        {
            var meetings = await _meetingService.GetAllMeetings();
            return Ok(meetings);
        }

        //שליפה לפי צוות

        [HttpGet("team/{teamId}")]
        public async Task<ActionResult<List<MeetingDTO>>> GetByTeamId(int teamId)
        {
           
            //var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var meetings = await _meetingService.GetMeetingsByTeamId(teamId);
            if (meetings == null)
            {
                return NotFound($"No meetings found for TeamId {teamId}");
            }
            return Ok(meetings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MeetingDTO>> GetById(int id)
        {
            var meeting = await _meetingService.GetMeetingById(id);
            if (meeting == null)
                return NotFound(new { message = "Meeting not found" });

            return Ok(meeting);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MeetingPostDTO meetingDto)
        {

            var meeting = _mapper.Map<Meeting>(meetingDto);
            await _meetingService.AddMeeting(meeting);
            return CreatedAtAction(nameof(GetById), new { id = meeting.Id }, _mapper.Map<MeetingDTO>(meeting));
        }

        //עדכון קשור קובץ
        [HttpPut("update-meeting-file")]
        public async Task<IActionResult> UpdateMeetingFile([FromBody] UpdateMeetingFileRequest request)
        {
            if (string.IsNullOrEmpty(request.FileUrl) || request.MeetingId <= 0)
                return BadRequest(new { message = "פרמטרים לא תקינים" });

            bool success = await _meetingService.UpdateMeetingFileLink(request.MeetingId, request.FileUrl, request.IsTranscript);

            if (!success)
                return NotFound(new { message = "הפגישה לא נמצאה" });

            return Ok(new { message = "הקובץ עודכן בהצלחה בפגישה" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MeetingPostDTO meetingDto)
        {
            var updatedMeeting = await _meetingService.UpdateMeeting(id, meetingDto);
            if (updatedMeeting == null)
                return NotFound(new { message = "Meeting not found." });

            return Ok(updatedMeeting);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _meetingService.DeleteMeeting(id);
            if (!deleted)
                return NotFound(new { message = "Meeting not found." });

            return Ok(new { message = "Meeting deleted" });
        }

    }
}

