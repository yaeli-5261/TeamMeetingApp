using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.IServices
{
    public interface ITeamService
    {
        Task<List<TeamDTO>> GetAllTeams();
        Task<TeamDTO> GetTeamById(int id);
        Task AddTeam(Team team);
        Task<TeamDTO> UpdateTeam(int id, TeamPostDTO teamDto);
        Task<bool> DeleteTeam(int id);
    }
}
