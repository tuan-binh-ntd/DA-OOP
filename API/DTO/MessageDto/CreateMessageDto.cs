using System;

namespace API.DTO.MessageDto
{
    public class CreateMessageDto
    {
        public Guid TaskId { get; set; }
        public Guid SenderId { get; set; }
        public Guid RecipientId { get; set; }
        public string Content { get; set; }
    }
}
