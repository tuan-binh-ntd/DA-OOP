using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entity
{
    [Table("Photos")]
    public class Photo
    {
        [Key]
        public Guid Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
        [ForeignKey("AppUser")]
        public Guid AppUserId { get; set; }
    }
}
