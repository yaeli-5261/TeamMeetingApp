using MeetSummarizer.Core.Entities;

namespace MeetSummarizer.Core.DTOs
{

    public class UserCreateDTO
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int TeamId { get; set; }
        public int RoleId { get; set; }

    }


    //todo
    public class UserDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public int TeamId { get; set; }
        public TeamPostDTO? Team { get; set; }

    }

    //public class UserDTO
    //{
    //    public int Id { get; set; }
    //    public string UserName { get; set; }
    //    public string Email { get; set; }
    //    public string Password { get; set; }
    //    public int TeamId { get; set; }
    //    public int RoleId { get; set; }
    //    public Role Role { get; set; }
    //    public Team Team { get; set; } // ⬅️ תוסיפי את זה
    //}

}
