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
    public class RoleService : IRoleService
    {
        private readonly IManagerRepository _managerRepository;

        public RoleService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<List<Role>> GetAllRoles()
        {
            return await _managerRepository.roleRepository.GetAllRoleAsync();
        }

        public async Task<Role> GetRoleById(int id)
        {
            return await _managerRepository.roleRepository.GetRoleByIdAsync(id);
        }

        public async Task<Role> AddRole(Role role)
        {
            Role r = await _managerRepository.roleRepository.AddRoleAsync(role);
            await _managerRepository.SaveAsync();
            return r;
        }
       
        public async Task UpdateRole(int id, Role role)
        {
            await _managerRepository.roleRepository.UpdateRoleAsync(id, role);
            await _managerRepository.SaveAsync();
        }
        public async Task DeleteRole(int id)
        {
            await _managerRepository.roleRepository.DeleteRoleAsync(id);
            await _managerRepository.SaveAsync();
        }
    }

}
