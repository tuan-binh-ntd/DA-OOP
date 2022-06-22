using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO.MessageDto
{
    public class MessageForViewDto
    {
        public Guid Id { get; set; }
        public Guid TasksId { get; set; }
        public Guid SenderId { get; set; }
        public string SenderUserName { get; set; }
        public Guid RecipientId { get; set; }
        public string RecipientUserName { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
    }
}
