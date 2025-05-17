using AutoMapper;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.Interfaces;
using MeetSummarizer.Core.IServices;
using Microsoft.AspNetCore.Mvc;

namespace MeetSummarizer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IMapper _mapper;

        public RoleController(IRoleService roleService, IMapper mapper)
        {
            _roleService = roleService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleDTO>>> GetAll()
        {
            var roles = await _roleService.GetAllRoles();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDTO>> GetById(int id)
        {
            var role = await _roleService.GetRoleById(id);
            if (role == null)
                return NotFound(new { message = "Role not found" });

            return Ok(role);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] RoleDTO roleDto)
        {
            var createdRole = _mapper.Map<Role>(roleDto);
            Role r = await _roleService.AddRole(createdRole);
            return r == null ? NotFound() : Ok(roleDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] RoleDTO roleDto)
        {
            var current = await _roleService.GetRoleById(id);
            if (current == null)
                return NotFound(new { message = "Role not found." });

            Role role = _mapper.Map<Role>(roleDto);
            await _roleService.UpdateRole(id, role);
            return Ok(new { message = "Role updated" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deletedRole = await _roleService.GetRoleById(id);
            if (deletedRole == null)
                return NotFound(new { message = "Role not found" });

            await _roleService.DeleteRole(id);
            return Ok(new { message = "Role deleted" });
        }
    }

}
