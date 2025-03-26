using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.Interfaces;
using MeetSummarizer.Core.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace MeetSummarizer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("Admin")]
        [Authorize(Roles = "Admin")]
        //[HttpGet]
        public async Task<ActionResult<List<UserDTO>>> GetAll()
        {
            var users = await _userService.GetAllUsers();
            return Ok(_mapper.Map<List<UserDTO >>(users));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] RegisterDto userDto)
        {
            var createdUser = _mapper.Map<User>(userDto);

            if (createdUser.Role == null)
            {
                Console.WriteLine("❌ Role is NULL before saving!");
            }

            User u = await _userService.AddUser(createdUser);

            return u == null ? NotFound() : Ok(userDto);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UserCreateDTO userDto)
        {

            var current = await _userService.GetUserById(id);
            if (current == null)
                return NotFound(new { message = "User not found." });

            User user = _mapper.Map<User>(userDto);
            await _userService.UpdateUser(id, user);
            return Ok(new { message = "User updated" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deletedUser = await _userService.GetUserById(id);
            if (deletedUser == null)
                return NotFound(new { message = "User not found." });

            await _userService.DeleteUser(id);
            return Ok(new { message = "User deleted" });
        }

    }
}
