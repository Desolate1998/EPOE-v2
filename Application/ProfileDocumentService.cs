using Domain.Data_Transfer_Objects;
using Domain.Models.Database;
using Domain.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application
{
    #region Interface

    public interface IProfileDocumentService
    {

        Task CreateProfileDocument(IFormFile File, string email, int profileDocumentTypeId);
        Task DeleteProfileDocument(int profileDocumentId);
        Task<List<StudentProfileDocumentInfo>> GetStudentProfileDocuments(string email);
        Task<int> UploadProfileDocument(IFormFile file, int profileDocumentTypeId, User user);
    }

    #endregion

    public class ProfileDocumentService : IProfileDocumentService
    {
        #region private fields
        private readonly DataContext _db;


        #endregion
        #region Constructor

        public ProfileDocumentService(DataContext db)
        {
            _db = db;
        }

        #endregion

        #region Public Methods
   


        public async Task CreateProfileDocument(IFormFile File, string email, int profileDocumentTypeId)
        {
            //#1 Store the document.
            //#2 Make an entry in the files table for the file.
            //#3 Make an entry in the profileDocuments table
            
            var user = _db.Users.SingleOrDefaultAsync(x => x.Email == email);
            //#1
            var profileDocumentType = _db.ProfileDocumentTypes.SingleOrDefaultAsync(x => x.Id == profileDocumentTypeId);
            
            var path = await new FileHandler().SaveFile(File, $"[ProfileDocument({profileDocumentType.Id})]" + user.Id);

            var file = new Domain.Models.Database.File()
            {
                Path = path,
                Size = File.Length,
            };
            //#2
            await _db.Files.AddAsync(file);
            await _db.SaveChangesAsync();
           
            //#3
            await _db.ProfileDocuments.AddAsync(new()
            {
                FileId = file.Id,
                ProfileDocumentTypeId = profileDocumentType.Id,
                Status = "Pending",

            });
            await _db.SaveChangesAsync();
        }

        public async Task DeleteProfileDocument(int profileDocumentId)
        {
            ProfileDocument profileDocument = await _db.ProfileDocuments.SingleOrDefaultAsync(x => x.Id == profileDocumentId) ??
                                throw new Exception("Can't find profileDocument to delete.");
            _db.ProfileDocuments.Remove(profileDocument);
            await _db.SaveChangesAsync();
        }

        public async Task<List<StudentProfileDocumentInfo>> GetStudentProfileDocuments(string email)
        {
            var student = await _db.Users.SingleOrDefaultAsync(x=>x.Email ==email );
            var profileDocumentInfo = new List<StudentProfileDocumentInfo>();
            var documents = await _db.ProfileDocumentTypes.Where(x=>x.Active).ToArrayAsync();
            for (int i = 0; i < documents.Length; i++)
            {
                var document = await _db.ProfileDocuments.SingleOrDefaultAsync(x=>x.ProfileDocumentTypeId == documents[i].Id && x.UserId==student.Id);
                if (document == null)
                {
                    profileDocumentInfo.Add(new StudentProfileDocumentInfo
                    {
                        DocumentDescription = documents[i].Description,
                        DocumentName = documents[i].Name,
                        FileId = null,
                        Status = "Missing",
                        Comment = "",
                        ProfileDocumentId = documents[i].Id

                    });
                }
                else
                {
                    var file = await _db.Files
                        .Where(x=>x.Id==document.FileId)
                        .Include(x=>x.Uploader)
                        .SingleOrDefaultAsync();
                    profileDocumentInfo.Add(new StudentProfileDocumentInfo
                    {
                        DocumentDescription = documents[i].Description,
                        DocumentName = documents[i].Name,
                        FileId = document.FileId,
                        Status = document.Status,
                        Comment = document.Comment,
                        ProfileDocumentId = document.ProfileDocumentTypeId,
                        FileName = $"{file.Uploader.FirstName} {file.Uploader.LastName}  [{documents[i].Name}].{file.Path.Substring(file.Path.IndexOf('.'))}"

                    });
                }
            }


            return profileDocumentInfo;
        }


        public async Task<int> UploadProfileDocument(IFormFile file,int profileDocumentTypeId,User user)
        {
            try
            {
                FileHandler fh = new FileHandler();
                var profileDocument = await _db.ProfileDocuments
                    .Where(x => x.UserId == user.Id && x.ProfileDocumentTypeId == profileDocumentTypeId)
                    .Include(x=>x.File)
                    .SingleOrDefaultAsync();



                if (profileDocument != null)
                {
         
                }
                var path = await fh.SaveFile(file, $"[ProfileDocument({profileDocumentTypeId}){user.Id}]");
                var fileInfo = new Domain.Models.Database.File()
                {
                    DateUploaded = DateTime.Now,
                    Path = path,
                    Size =  1048576/ file.Length ,
                    UploaderId = user.Id
                };
                await _db.Files.AddAsync(fileInfo);
                _db.SaveChanges();
                _db.ProfileDocuments.Add(new()
                {
                    Comment = "",
                    FileId = fileInfo.Id,
                    ProfileDocumentTypeId = profileDocumentTypeId,
                    Status = "Pending",
                    UserId = user.Id
                });
                await _db.SaveChangesAsync();
                return fileInfo.Id;
            }
            catch (Exception)
            {

                throw;
            }

        } 

        #endregion
    }
}

