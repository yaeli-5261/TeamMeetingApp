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
    public class TeamRepository : ITeamRepository
    {
        private readonly DataContext _context;

        public TeamRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Team>> GetAllTeamsAsync()
        {
            return await _context.Teams.Include(t => t.TeamMembers).ToListAsync();
        }

        public async Task<Team> GetTeamByIdAsync(int id)
        {
            return await _context.Teams.Include(t => t.TeamMembers).FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task AddTeamAsync(Team team)
        {
            await _context.Teams.AddAsync(team);
            await _context.SaveChangesAsync();
        }

        public async Task<Team> UpdateTeamAsync(int id, Team team)
        {
            var existingTeam = await GetTeamByIdAsync(id);
            if (existingTeam == null)
                return null;

            existingTeam.Name = team.Name;
            existingTeam.TeamMembers = team.TeamMembers;

            await _context.SaveChangesAsync();
            return existingTeam;
        }

        public async Task<bool> DeleteTeamAsync(int id)
        {
            var team = await GetTeamByIdAsync(id);
            if (team == null)
                return false;

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
