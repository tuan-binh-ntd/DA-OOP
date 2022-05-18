using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Enum;

namespace API.DTO
{
    public class SearchTaskDto : FilterDto
    {
        public string TaskName { get; set; }
        public Priority? PriorityCode { get; set; }
        public StatusCode? StatusCode { get; set; }
        public string TaskType { get; set; }
        public string TaskCode { get; set; }
        public DateTime? CreateDateFrom { get; set; }
        public DateTime? CreateDateTo { get; set; }
        public DateTime? DeadlineDateFrom { get; set; }
        public DateTime? DeadlineDateTo { get; set; }
        public DateTime? CompleteDateFrom { get; set; }
        public DateTime? CompleteDateTo { get; set; }
    }
}
