using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.IServices
{
    public interface IRoleService
    {
        Task<List<Role>> GetAllRoles();
        Task<Role> GetRoleById(int id);
        Task<Role> AddRole(Role role);
        Task UpdateRole(int id, Role role);
        Task DeleteRole(int id);
    }


}
