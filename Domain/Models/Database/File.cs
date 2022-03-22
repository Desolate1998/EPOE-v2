using System;

namespace Domain.Models.Database
{
    public class File
    {
        public int Id { get; set; }
        public string UploaderId { get; set; }
        public DateTime DateUploaded { get; set; }
        public long Size { get; set; }
        public string Path { get; set; }
        public virtual User Uploader { get; set; }
    }
}
