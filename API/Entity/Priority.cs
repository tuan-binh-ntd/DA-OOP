using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entity
{
    public class Priority
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(10)]
        public string PriorityName { get; set; }
        public ICollection<Task> Task { get; set; }
    }
}
