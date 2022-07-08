using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entity
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }
        [Required, StringLength(1024)]
        public string Content { get; set; }
        [Required]
        public Guid AppUserId { get; set; }
        public DateTime CreateDate { get; set; }
        public bool IsRead { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? TasksId { get; set; }
    }
}
