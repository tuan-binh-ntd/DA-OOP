using API.Enum;
using System;

namespace API.DTO
{
    public class CreateTaskDto
    {
        public string TaskName { get; set; }
        public Guid CreateUserId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority PriorityCode { get; set; }
        public StatusCode StatusCode { get; set; }
        public string Description { get; set; }
        public Guid ProjectId { get; set; }
        public Guid AppUserId { get; set; }
    }
}
