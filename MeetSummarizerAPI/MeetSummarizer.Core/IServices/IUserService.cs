using System.Collections.Generic;
using System.Threading.Tasks;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;

namespace MeetSummarizer.Core.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsers();
        Task<User> GetUserById(int id);
        Task<User> GetUserByNameAndPasswordAsync(string password,string email);
        Task<User> AddUser(User user);
        Task UpdateUser(int id, User user);
        Task DeleteUser(int id);
    }

}
