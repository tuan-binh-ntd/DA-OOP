using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entity
{
    public class Photo
    {
        [Key]
        public Guid Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
    }
}
