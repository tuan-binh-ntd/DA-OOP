using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class Department
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [StringLength(100)]
        public string DepartmentName { get; set; }
        public ICollection<AppUser> AppUser { get; set; }
        public ICollection<Project> Project { get; set; }

    }
}
