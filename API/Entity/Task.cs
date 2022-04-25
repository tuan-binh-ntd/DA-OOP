using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Task
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string TaskName { get; set; }
        [Required]
        public int CreateUserId { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        [Required]
        public DateTime DeadlineDate { get; set; }
        [Required]
        public DateTime CompleteDate { get; set; }
        [Required]
        [ForeignKey("Priority")]
        public int PriorityId { get; set; }
        [Required]
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        [Required]
        [ForeignKey("Status")]
        public int StatusId { get; set; }
        public ICollection<AppUser> AppUsers { get; set; }
    }
}
