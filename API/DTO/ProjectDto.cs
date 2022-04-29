using API.Enum;
using System;

namespace API.DTO
{
    public class ProjectDto
    {
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public Priority PriorityCode { get; set; }
        public StatusCode StatusCode { get; set; }
        public Guid DepartmentId { get; set; }
    }
}
