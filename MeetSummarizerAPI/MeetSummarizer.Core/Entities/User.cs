using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;

namespace MeetSummarizer.Core.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public int TeamId { get; set; }

        //[DefaultValue(21)]
        //[ForeignKey("RoleId")]
        public int RoleId { get; set; }
        public Role Role { get; set; }

        public Team Team { get; set; }  // ⬅️ הוספה חשובה!
      

    }
}
