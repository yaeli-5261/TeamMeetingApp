using System.Collections.Generic;
using System.Threading.Tasks;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using MeetSummarizer.Core.Interfaces;
using System;
using MeetSummarizer.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using MeetSummarizer.Core.IRepository;
using MeetSummarizer.Data.Repositories;

public class UserService :IUserService
{
    private readonly IManagerRepository _managerRepository;

    public UserService(IManagerRepository managerRepository)
    {
        _managerRepository = managerRepository;
    }

    public async Task<List<User>> GetAllUsers()
    {
        return await _managerRepository.userRepository.GetAllUsersAsync();
    }
   

    public async Task<User> GetUserById(int id)
    {
        return await _managerRepository.userRepository.GetUserByIdAsync(id);
    }

    public async Task<User> GetUserByNameAndPasswordAsync(string password,string email)
    {
        return await _managerRepository.userRepository.GetUserByNameAndPasswordAsync(password,email);
    }

    public async Task<User> AddUser(User user)
    {
        user.Role = await _managerRepository.roleRepository.GetRoleByIdAsync(user.RoleId)
            ?? throw new Exception("Role not found");

        var newUser = await _managerRepository.userRepository.AddUserAsync(user);

        newUser.Role = user.Role;

        await _managerRepository.SaveAsync();

        return newUser;
    }

    public async Task UpdateUser(int id, User user)
    {
        await _managerRepository.userRepository.UpdateUserAsync(id, user);
        await _managerRepository.SaveAsync();
    }

    public async Task DeleteUser(int id)
    {
        await _managerRepository.userRepository.DeleteUserAsync(id);
        await _managerRepository.SaveAsync();
    }
}
