namespace Domain.Models.Database
{
    public class ExtraDocument
    {
        public int Id { get; set; }
        public int FileId { get; set; }
        public int ExtraDocumentId { get; set; }
        public string Status { get; set; }
        public virtual File File { get; set; }

        public virtual ExtraDocumentType ExtraDocumentType { get; set; }
    }
}
