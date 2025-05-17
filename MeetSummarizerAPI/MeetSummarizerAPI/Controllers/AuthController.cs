
using AutoMapper;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.Interfaces;
using MeetSummarizer.Core.IServices;
using MeetSummarizer.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetSummarizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AuthService _authService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration configuration, AuthService authService, IUserService userService, IMapper mapper)
        {
            _configuration = configuration;
            _authService = authService;
            _userService = userService;
            _mapper = mapper;
        }


        //    [HttpPost("login")]
        //    public async Task<IActionResult> Login([FromBody] LoginModel model)
        //    {
        //        var user = await _userService.GetUserByNameAndPasswordAsync(model.Password, model.Email);
        //        Console.WriteLine("bla "+user.Role?.RoleName);
        //        // בדיקה אם המשתמש קיים ויש לו תפקיד Admin
        //        if (user != null && user.Role?.RoleName == "Admin")
        //        {
        //            var token = _authService.GenerateJwtToken(model.Email, new[] { user.Role.RoleName }, user.Id);

        //            return Ok(new
        //            {
        //                Token = token,
        //                User = new
        //                {
        //                    user.UserName,
        //                    user.TeamId,
        //                    user.Role
        //                }
        //            });
        //        }

        //        return Unauthorized("Only Admins can log in.");
        //    }

        //    [HttpPost("register")]
        //    //[Authorize(Roles = "Admin")]
        //    public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto model)
        //    {
        //        if (model == null)
        //            return Conflict("User is not valid");

        //        // שליחת הנתונים ל- UserService
        //        var createdUser = _mapper.Map<User>(model);
        //        var newUser = await _userService.AddUser(createdUser);
        //        if (newUser == null)
        //            return BadRequest("Error creating user");

        //        // יצירת טוקן JWT עם שם התפקיד
        //        var token = _authService.GenerateJwtToken(createdUser.UserName, new[] { newUser.Role.RoleName }, newUser.Id);


        //        return Ok(new { Token = token, User = newUser });
        //    }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userService.GetUserByNameAndPasswordAsync(model.Password, model.Email);
            if (user == null)
                return Unauthorized("User not found");

            var token = _authService.GenerateJwtToken(model.Email, new[] { user.Role.RoleName }, user.Id);

            return Ok(new
            {
                Token = token,
                User = new
                {
                    user.UserName,
                    user.TeamId,
                    user.Role
                }
            });
        }

        [HttpPost("register")]
        [Authorize(Roles = "Admin")] // ✅ מאפשר רק למנהלים לרשום משתמשים חדשים
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto model)
        {
            if (model == null)
                return Conflict("User is not valid");

            var createdUser = _mapper.Map<User>(model);
            var newUser = await _userService.AddUser(createdUser);
            if (newUser == null)
                return BadRequest("Error creating user");

            var token = _authService.GenerateJwtToken(createdUser.UserName, new[] { newUser.Role.RoleName }, newUser.Id);

            return Ok(new { Token = token, User = newUser });
        }

    }

}

