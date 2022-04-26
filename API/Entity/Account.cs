using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Account
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string UserName { get; set; }
        [Required]
        [StringLength(100)]
        public string Password { get; set; }
        [Required]
        [ForeignKey("AppUser")]
        public int UserId { get; set; }
        [Required]
        [ForeignKey("Permission")]
        public int PermissionId { get; set; }
        [Required]
        [ForeignKey("Task")]
        public int TaskId { get; set; }
    }
}
