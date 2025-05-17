using AutoMapper;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.IRepository;
using MeetSummarizer.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Service
{
    public class TeamService : ITeamService
    {
        private readonly IManagerRepository _managerRepository;
        private readonly IMapper _mapper;

        public TeamService(IManagerRepository managerRepository, IMapper mapper)
        {
             _managerRepository = managerRepository;
            _mapper = mapper;
        }

        public async Task<List<TeamDTO>> GetAllTeams()
        {
            var teams = await _managerRepository.teamRepository.GetAllTeamsAsync();
            return _mapper.Map<List<TeamDTO>>(teams);
        }

        public async Task<TeamDTO> GetTeamById(int id)
        {
            var team = await _managerRepository.teamRepository.GetTeamByIdAsync(id);
            return team != null ? _mapper.Map<TeamDTO>(team) : null;
        }

        public async Task AddTeam(Team team)
        {
            await _managerRepository.teamRepository.AddTeamAsync(team);
            await _managerRepository.SaveAsync();
        }

        public async Task<TeamDTO> UpdateTeam(int id, TeamPostDTO teamDto)
        {
            var updatedTeam = await _managerRepository.teamRepository.UpdateTeamAsync(id, _mapper.Map<Team>(teamDto));
            return updatedTeam != null ? _mapper.Map<TeamDTO>(updatedTeam) : null;
        }

        public async Task<bool> DeleteTeam(int id)
        {
            return await _managerRepository.teamRepository.DeleteTeamAsync(id);
        }
    }
}
