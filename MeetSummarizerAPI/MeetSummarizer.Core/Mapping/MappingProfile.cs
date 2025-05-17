using AutoMapper;
using MeetSummarizer.Core.DTOs;
using MeetSummarizer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<Meeting, MeetingDTO>().ReverseMap();
            CreateMap<Meeting, MeetingPostDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
        

           // CreateMap<RegisterDto, User>()
           //.ForMember(dest => dest.Role, opt => opt.Ignore());  // AutoMapper לא ינסה למפות Role

            CreateMap<Team, TeamDTO>().ReverseMap();
            CreateMap<Team, TeamPostDTO>().ReverseMap();
            CreateMap<User, UserCreateDTO>().ReverseMap();
            CreateMap<Role, RoleDTO>().ReverseMap();
            CreateMap<RegisterDto, User>().ReverseMap();
          
        }
    }
}
