using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Data_Transfer_Objects
{
    public class StudentProfileDocumentInfo
    {
        public string DocumentName { get; set; }
        public string DocumentDescription { get; set; }
        public string Status { get; set; }
        public string Comment { get; set; }
        public string FileName { get; set; }
        public int ProfileDocumentId { get; set; }
        public int? FileId { get; set; }
    }
}
