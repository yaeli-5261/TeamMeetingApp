using AutoMapper;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.IServices;
using Microsoft.AspNetCore.Mvc;

namespace MeetSummarizerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;
        private readonly IMapper _mapper;

        public TeamController(ITeamService teamService, IMapper mapper)
        {
            _teamService = teamService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<TeamDTO>>> GetAll()
        {
            var teams = await _teamService.GetAllTeams();
            return Ok(teams);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDTO>> GetById(int id)
        {
            var team = await _teamService.GetTeamById(id);
            if (team == null)
                return NotFound(new { message = "Team not found" });

            return Ok(team);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TeamPostDTO teamDto)
        {
            var team = _mapper.Map<Team>(teamDto);
            await _teamService.AddTeam(team);
            return CreatedAtAction(nameof(GetById), new { id = team.Id }, _mapper.Map<TeamDTO>(team));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TeamPostDTO teamDto)
        {
            var updatedTeam = await _teamService.UpdateTeam(id, teamDto);
            if (updatedTeam == null)
                return NotFound(new { message = "Team not found." });

            return Ok(updatedTeam);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _teamService.DeleteTeam(id);
            if (!deleted)
                return NotFound(new { message = "Team not found." });

            return Ok(new { message = "Team deleted" });
        }
    }
}
