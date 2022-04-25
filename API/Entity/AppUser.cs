using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    [Table("AppUsers")]
    public class AppUser
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(20)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(20)]
        public string LastName { get; set; }
        [Required]
        [StringLength(100)]
        public string Address { get; set; }
        [Required]
        [StringLength(50)]
        public string Email { get; set; }
        [Required]
        [StringLength(11)]
        public string Phone { get; set; }
        [Required]
        [ForeignKey("Permission")]
        public int PermissionId { get; set; }
        [ForeignKey("Task")]
        public int TaskId { get; set; }
        [Required]
        [StringLength(50)]
        public string PassWord { get; set; }
    }
}
