using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
namespace Domain.Utilities
{
    public static class FilesPaths
    {
        public static readonly string ProfilePictures = "\\ProfilePictures\\";

    }

    public  class FileHandler
    {
        private readonly string _Path = "C:\\Data\\";
   
   
        public FileHandler()
        {
            
        }
        /// <summary>
        /// Gets the file exstension from a file name.
        /// </summary>
        /// <param name="name">file name</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public string getExtension(string fileName)
        {
            int start = fileName.LastIndexOf('.');
            if (start == -1)
                throw new Exception("Invalid File");
            return fileName.Substring(start);
        }

        /// <summary>
        /// Stores the file on the root path on the system.
        /// </summary>
        /// <param name="filePath">The Destination</param>
        /// <param name="file">The File</param>
        /// <param name="">The Name Of The File</param>
        /// <returns></returns>
        public async Task<string> SaveFile(IFormFile file, string name)
        {
            var ext = getExtension(file.FileName);
            string fileName = _Path  + name + ext;
            using (var fileStream = new FileStream(fileName, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
                fileStream.Close();
            }
            return name + ext;
        }

        /// <summary>
        /// Stores the file on the given path on the system.
        /// </summary>
        /// <param name="filePath">The Destination</param>
        /// <param name="file">The File</param>
        /// <param name="">The Name Of The File</param>
        /// <returns></returns>
        public  async Task<string> SaveFile(string filePath,IFormFile file,string name)
        {
            var ext = getExtension(file.FileName);
            string fileName = _Path + filePath + name + ext;
            using (var fileStream = new FileStream(fileName, FileMode.Create)) 
            {
                await file.CopyToAsync(fileStream);
                fileStream.Close();
            }
            return name + ext;
        }

        /// <summary>
        /// Removes a file.
        /// </summary>
        /// <param name="filePath">Directory in which the file is.</param>
        /// <param name="name">Name of the file (Including the exstension)</param>
        public void DeleteFile(string filePath,string name)
        {

            try
            {
                File.Delete(_Path+filePath + name);

            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<Data_Transfer_Objects.File>  DownloadFileFile(string path)
        {
            try
            {
                var file = new Data_Transfer_Objects.File();
                file.MimeType = MimeMapping.MimeUtility.GetMimeMapping(path);
                file.Data = await System.IO.File.ReadAllBytesAsync(_Path + path);
                return file;
            }
            catch (Exception e)
            {

                throw;
            }
            
        }

    }
}
