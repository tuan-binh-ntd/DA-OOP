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
        [Required]
        [StringLength(50)]
        public string ProjectName { get; set; }
        public string Description { get; set; }
        [Required]
        public DateTime CreateDate { get; set; } = new DateTime();
        [Required]
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        [Required]
        public Priority PriorityCode { get; set; }
        [Required]
        public StatusCode StatusCode { get; set; }
        [Required]
        [ForeignKey("Department")]
        public Guid DepartmentId { get; set; }
        public ICollection<Task> Task { get; set; }
    }
}
