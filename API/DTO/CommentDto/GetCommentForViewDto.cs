using System;

namespace API.DTO
{
    public class GetCommentForViewDto
    {
        public Guid Id { get; set; }
        public Guid AppUserId { get; set; }
        public Guid TaskId { get; set; }
        public string CommentContent { get; set; }
        public string UserNameForComment { get; set; }
        public DateTime CommentDate { get; set; }
    }
}
