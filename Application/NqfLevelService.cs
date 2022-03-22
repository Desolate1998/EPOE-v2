using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;
using Domain.Models.Database;
using Domain.Models.ExtraDetails;
using Domain.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData;
using Persistent;

namespace Application
{
    #region Interface

    public interface INqfLevelService
    {
        Task ValidateNqfLevel(NqfLevel nqfLevel);
        Task<int> CreateNqfLevel(NqfLevel nqfLevel);
        Task DeleteNqfLevel(int nqfLevelId);
    }



    #endregion


    public class NqfLevelService:INqfLevelService
    {
        #region private fields
        private readonly DataContext _db;


        #endregion
        #region Constructor

        public NqfLevelService(DataContext db)
        {
            _db = db;
        }

        #endregion

        #region Public Methods
        public async Task ValidateNqfLevel(NqfLevel nqfLevel)
        {
            if (await _db.NqfLevels.Where(x => x.Name == nqfLevel.Name).AnyAsync())
            {
                throw new Exception("NQF level already exists");
            }
        }

        public async Task<int> CreateNqfLevel(NqfLevel nqfLevel)
        {
            await ValidateNqfLevel(nqfLevel);
            _db.NqfLevels.Add(nqfLevel);
            await _db.SaveChangesAsync();
            await _db.SaveChangesAsync();
            return nqfLevel.Id;

        }

        public async Task DeleteNqfLevel(int nqfLevelId)
        {
          
                NqfLevel nqfLevel = await _db.NqfLevels.SingleOrDefaultAsync(x => x.Id == nqfLevelId) ??
                                    throw new Exception("Can't find nqfLevel to delete.");

                if (await _db.Qualifications.FirstOrDefaultAsync(x => x.NqfLevelId == nqfLevelId) != null)
                    throw new Exception(
                        "Can not delete this NQF level. Please change qualifications which is linked to it first");
                _db.NqfLevels.Remove(nqfLevel);
                await _db.SaveChangesAsync();


        }
        #endregion
    }
}
