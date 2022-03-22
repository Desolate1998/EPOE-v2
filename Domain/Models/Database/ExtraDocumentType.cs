using System.Collections.Generic;
namespace Domain.Models.Database
{
    public class ExtraDocumentType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }

        public bool ReadOnly { get; set; }
        public virtual ICollection<ExtraDocument> ExtraDocuments { get; set; }

    }
}
