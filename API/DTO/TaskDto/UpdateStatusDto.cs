using API.Enum;
using System;

namespace API.DTO.TaskDto
{
    public class UpdateStatusDto
    {
        public Guid TaskId { get; set; }
        public StatusCode StatusCode { get; set; }
    }
}
