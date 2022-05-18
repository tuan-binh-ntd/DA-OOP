using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class FilterDto
    {
        public string SortColumn { get; set; }
        public bool SortAscending { get; set; }
    }
}
