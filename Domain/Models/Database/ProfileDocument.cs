namespace Domain.Models.Database
{
    public class ProfileDocument
    {
        public int Id { get; set; }
        public int FileId { get; set; }
        public int ProfileDocumentTypeId { get; set; }
        public string Status { get; set; }
        public string Comment { get; set; }
        public string UserId { get; set; }
        public virtual File File { get; set; }
        public virtual ProfileDocumentType ProfileDocumentType { get; set; }
     

    }
}
