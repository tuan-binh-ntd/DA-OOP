using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Message
    {
        [Required, Key]
        public Guid Id { get; set; }
        [Required, ForeignKey("Task")]
        public Guid TaskId { get; set; }
        [Required, ForeignKey("AppUser")]
        public Guid SenderId { get; set; }
        [Required, StringLength(40)]
        public string SenderUserName { get; set; }
        public AppUser Sender { get; set; }
        [Required, ForeignKey("AppUser")]
        public Guid RecipientId { get; set; }
        [Required, StringLength(40)]
        public string RecipientUserName { get; set; }
        public AppUser Recipient { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.Now;
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
    }
}
