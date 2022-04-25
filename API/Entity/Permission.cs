using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entity
{
    public class Permission
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(20)]
        public string PermissionName { get; set; }
        public ICollection<AppUser> AppUsers { get; set; }
    }
}
