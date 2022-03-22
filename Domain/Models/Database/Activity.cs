using System.Collections.Generic;

namespace Domain.Models.Database
{

    public class Activity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
        public int ModuleId { get; set; }
        public Module Module { get; set; }
    }

}