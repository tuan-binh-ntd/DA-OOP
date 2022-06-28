using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    public class SubTask
    {
        [Key]
        public Guid Id { get; set; }
        [Required, ForeignKey("Tasks")]
        public Guid TasksId { get; set; }
        [Required, StringLength(1024)]
        public string SubTaskName { get; set; }
        public bool? Status { get; set; }
        public DateTime? TimeTracking { get; set; }
    }
}
