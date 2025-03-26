using MeetSummarizer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.IRepository
{
    public interface ITeamRepository
    {
        Task<List<Team>> GetAllTeamsAsync();
        Task<Team> GetTeamByIdAsync(int id);
        Task AddTeamAsync(Team team);
        Task<Team> UpdateTeamAsync(int id, Team team);
        Task<bool> DeleteTeamAsync(int id);
    }
}


