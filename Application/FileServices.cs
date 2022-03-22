using Domain.Data_Transfer_Objects;
using Domain.Utilities;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application
{
    public interface IFileServices 
    {
        Task<File> GetFile(int id);
    }

    public class FileServices:IFileServices
    {
        private readonly DataContext _db;

        public FileServices(DataContext db)
        {
            _db = db;
        }

        public async Task<File> GetFile(int id)
        {
            var fileInfo = await _db.Files.SingleOrDefaultAsync(x => x.Id == id);
            var fh = new FileHandler();
            return await fh.DownloadFileFile(fileInfo.Path);
        }
    }
}
