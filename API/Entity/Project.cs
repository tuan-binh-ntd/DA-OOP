using API.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Project
    {
        [Key]
        public Guid Id { get; set; }
        [Required, StringLength(1024)]
        public string ProjectName { get; set; }
        public string Description { get; set; }
        [Required, StringLength(50)]
        public string ProjectType { get; set; }
        [Required, StringLength(50)]
        public string ProjectCode { get; set; }
        [Required]
        public DateTime CreateDate { get; set; } = DateTime.Now;
        [Required]
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        [Required]
        public Priority PriorityCode { get; set; }
        [Required]
        public StatusCode StatusCode { get; set; }
        [Required, ForeignKey("Department")]
        public Guid DepartmentId { get; set; }
        public ICollection<Tasks> Task { get; set; }
    }
}
