using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO.PhotoDto
{
    public class PhotoForViewDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }

    }
}
