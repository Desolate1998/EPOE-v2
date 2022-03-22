using System.Collections.Generic;

namespace Domain.Models.Database
{

    public class Module
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int QualificationId { get; set; }   
        public string Description { get; set; }
        public bool Active { get; set; }
        public Qualification Qualification { get; set; }
        public ICollection<Activity> Activities{ get; set; }
    }
}