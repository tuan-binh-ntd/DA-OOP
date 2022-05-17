using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Comment
    {
        [Key]
        public Guid Id { get; set; }
        [Required, ForeignKey("AppUser")]
        public Guid AppUserId { get; set; }
        [Required, ForeignKey("Task")]
        public Guid TasksId { get; set; }
        [Required, StringLength(1000)]
        public string CommentContent { get; set; }
        [Required]
        public DateTime CommentDate { get; set; } = DateTime.Now;
    }
}
