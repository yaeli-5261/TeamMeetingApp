using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.DTOs
{
    public class LoginResponseDto
    {
        public UserDTO User { get; set; }
        public string Token { get; set; }
    }
}
