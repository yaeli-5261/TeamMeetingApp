using MeetSummarizer.Core.Entities;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MeetSummarizer.Core.DTOs
{

    public class RoleDTO
    {
        public string RoleName { get; set; }
        public string Description { get; set; }
    }


}
