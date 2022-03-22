using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Database
{
    public class Qualification
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }

        public string Description { get; set; }

        public int NqfLevelId { get; set; }
        public NqfLevel NqfLevel { get; set; }

        public ICollection<Module>  Modules { get; set; }

    
    }
}


