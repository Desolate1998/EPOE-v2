using Domain.Models.Database;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Application
{
    #region Interface

    public interface IProfileDocumentTypeService
    {
        Task ValidateProfileDocumentType(ProfileDocumentType profileDocumentType);
        Task<int> CreateProfileDocumentType(ProfileDocumentType profileDocumentType);
        Task DeleteProfileDocumentType(int profileDocumentTypeId);
    }



    #endregion

    public class ProfileDocumentTypeService : IProfileDocumentTypeService
    {
        #region private fields
        private readonly DataContext _db;


        #endregion
        #region Constructor

        public ProfileDocumentTypeService(DataContext db)
        {
            _db = db;
        }

        #endregion

        #region Public Methods
        public async Task ValidateProfileDocumentType(ProfileDocumentType profileDocumentType)
        {
            if (await _db.ProfileDocumentTypes.Where(x => x.Name == profileDocumentType.Name).AnyAsync())
            {
                throw new Exception("ProfileDocumentType already exists");
            }
        }


        public async Task<int> CreateProfileDocumentType(ProfileDocumentType profileDocumentType)
        {
            await ValidateProfileDocumentType(profileDocumentType);
            profileDocumentType.Active = true;
            _db.ProfileDocumentTypes.Add(profileDocumentType);
            await _db.SaveChangesAsync();
            return profileDocumentType.Id;
        }

        public async Task DeleteProfileDocumentType(int profileDocumentTypeId)
        {
            ProfileDocumentType profileDocumentType = await _db.ProfileDocumentTypes.SingleOrDefaultAsync(x => x.Id == profileDocumentTypeId) ??
                                throw new Exception("Can't find profileDocument type to delete.");
            profileDocumentType.Active = false;
            await _db.SaveChangesAsync();
        }
        #endregion
    }
}

