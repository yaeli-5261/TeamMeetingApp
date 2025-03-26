using MeetSummarizer.Core.IRepository;
using MeetSummarizer.Core.IServices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Data.Repositories
{
    public class ManagerRepository: IManagerRepository
    {
        private readonly DataContext context;
        public IMeetingRepository meetingRepository { get; }
        public IRoleRepository roleRepository { get; }
        public IUserRepository userRepository { get; }
        public ITeamRepository teamRepository { get; }

        public ManagerRepository(DataContext _context
                                , IMeetingRepository _meetingRepository,
                                 IRoleRepository _roleRepository,
                                 IUserRepository _userRepository,
                                 ITeamRepository _teamRepository)
        {
            meetingRepository = _meetingRepository;
            roleRepository = _roleRepository;   
            userRepository = _userRepository;
            teamRepository = _teamRepository;
            context = _context;
        }

        public async Task SaveAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}
