using API.DTO.ProjectDto;
using API.Enum;
using System;
using System.Collections.Generic;

namespace API.DTO
{
    public class GetAllProjectForViewDto
    {
        public Guid Id { get; set; }
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public string ProjectType { get; set; }
        public string ProjectCode { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public int DayLefts { get; set; }
        public Priority PriorityCode { get; set; }
        public StatusCode StatusCode { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid AppUserId { get; set; }
        public string LeaderName { get; set; }
        public int TaskCount { get; set; } = 0;
        public decimal TaskProgress { get; set; } = 0;
        public List<GetAllUserForProjectDto> UserList { get; set; }
    }
}
