using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Data_Transfer_Objects
{
    public class File
    {
        public string MimeType { get; set; }
        public byte[] Data  { get; set; }
    }
}
