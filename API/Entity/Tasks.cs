using API.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Tasks
    {
        [Key]
        public Guid Id { get; set; }
        [Required, StringLength(50)]
        public string TaskName { get; set; }
        [Required]
        public Guid CreateUserId { get; set; }
        [Required]
        public DateTime CreateDate { get; set; } = new DateTime();
        [Required]
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        [Required, StringLength(50)]
        public Priority PriorityCode { get; set; }
        [Required, StringLength(50)]
        public StatusCode StatusCode { get; set; }
        public string Description { get; set; }
        [Required, StringLength(50)]
        public string TaskType { get; set; }
        [Required, StringLength(50)]
        public string TaskCode { get; set; }
        [Required]
        [ForeignKey("Project")]
        public Guid ProjectId { get; set; }
        [ForeignKey("AppUser")]
        public Guid? AppUserId { get; set; }
        public ICollection<Message> Message { get; set; }

    }
}
