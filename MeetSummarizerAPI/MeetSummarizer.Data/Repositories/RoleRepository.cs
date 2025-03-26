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
    public class RoleRepository : IRoleRepository
    {
        private readonly DataContext _context;

        public RoleRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Role>> GetAllRoleAsync()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<Role> GetRoleByIdAsync(int id)
        {
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Id == id);

            if (role == null)
            {
                return null;
            }
            return role;
        }
        public async Task<Role> AddRoleAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
            return role;
        }

        public async Task UpdateRoleAsync(int id, Role role)
        {
            var roleToUpdate = await GetRoleByIdAsync(id);
            if (roleToUpdate == null)
            {
                throw new KeyNotFoundException($"Role with id {id} not found");
            }

            role.RoleName = roleToUpdate.RoleName;
            role.Description = roleToUpdate.Description;
        }

        public async Task DeleteRoleAsync(int id)
        {
            var role = await GetRoleByIdAsync(id);
            if (role != null)
                _context.Roles.Remove(role);
        }
    }


}
