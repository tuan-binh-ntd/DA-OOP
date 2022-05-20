using System;
using API.Enum;

namespace API.DTO
{
    public class GetAllProjectDto : FilterDto
    {
        public string ProjectName { get; set; }
        public string ProjectType { get; set; }
        public string ProjectCode { get; set; }
        public StatusCode? StatusCode { get; set; }
        public Priority? PriorityCode { get; set; }
        public DateTime? CreateDateFrom { get; set; }
        public DateTime? CreateDateTo { get; set; }
        public DateTime? DeadlineDateFrom { get; set; } 
        public DateTime? DeadlineDateTo { get; set; } 
        public DateTime? CompleteDateFrom { get; set; }
        public DateTime? CompleteDateTo { get; set; }
        //public StatusCode StatusCode { get; set; }
    }
}
