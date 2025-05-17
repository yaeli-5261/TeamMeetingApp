using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.DTOs
{
    public class TeamDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<UserDTO> TeamMembers { get; set; }
    }

    public class TeamPostDTO
    {
        public string Name { get; set; }
    }
}

