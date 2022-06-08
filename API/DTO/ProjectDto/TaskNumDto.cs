using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO.ProjectDto
{
    public class TaskNumDto
    {
        public Guid ProjectId { get; set; }
        public int TaskNum { get; set; }
    }
}
