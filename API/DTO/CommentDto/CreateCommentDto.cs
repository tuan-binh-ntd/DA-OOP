using System;

namespace API.DTO
{
    public class CreateCommentDto
    {
        public Guid AppUserId { get; set; }
        public Guid TaskId { get; set; }
        public string CommentContent { get; set; }
        public DateTime CommentDate { get; set; } = DateTime.Now;
    }
}
