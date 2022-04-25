using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entity
{
    public class Status
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(10)]
        public string StatusName { get; set; }

        public ICollection<Task> Tasks { get; set; }

    }
}
