using API.Enum;
using System;

namespace API.DTO.ProjectDto
{
    public class UpdateProjectStatusDto
    {
        public Guid ProjectId { get; set; }
        public StatusCode StatusCode { get; set; }
    }
}
