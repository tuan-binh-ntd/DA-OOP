using API.Enum;
using System;

namespace API.DTO
{
    public class ModifyTaskDto
    {
        public string TaskName { get; set; }
        public string CreateUserName { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public StatusCode StatusCode { get; set; }
    }
}
