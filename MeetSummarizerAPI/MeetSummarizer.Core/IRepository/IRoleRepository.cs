using MeetSummarizer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.IRepository
{
    public interface IRoleRepository
    {
        Task<List<Role>> GetAllRoleAsync();
        Task<Role> GetRoleByIdAsync(int id);
        Task <Role> AddRoleAsync(Role role);
        Task UpdateRoleAsync(int id, Role role);
        Task DeleteRoleAsync(int id);
    }


}
