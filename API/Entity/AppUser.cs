using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enum;
namespace API.Entity
{
    public class AppUser
    {
        [Key]
        public Guid Id { get; set; }
        [Required, StringLength(20)]
        public string FirstName { get; set; }
        [Required, StringLength(20)]
        public string LastName { get; set; }
        [Required, StringLength(100)]
        public string Address { get; set; }
        [Required, StringLength(50)]
        public string Email { get; set; }
        [Required, StringLength(11)]
        public string Phone { get; set; }
        [Required, StringLength(100)]
        public string Password { get; set; }
        [Required, ForeignKey("Department")]
        public Guid DepartmentId { get; set; }
        [Required, StringLength(50)]
        public Permission PermissionCode { get; set; }
        public ICollection<Tasks> Task { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}
