using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entity
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public ICollection<Task> Tasks { get; set; }
    }
}
