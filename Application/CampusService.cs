using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models.Database;
using Microsoft.EntityFrameworkCore;
using Persistent;

namespace Application
{
    #region Interface

    public interface ICampusService
    {
        Task ValidateCampus(Campus campus);
        Task<int> CreateCampus(Campus campus);
        Task DeleteCampus(int campusId);
    }



    #endregion


    public class CampusService : ICampusService
    {
        #region private fields
        private readonly DataContext _db;


        #endregion
        #region Constructor

        public CampusService(DataContext db)
        {
            _db = db;
        }

        #endregion

        #region Public Methods
        public async Task ValidateCampus(Campus campus)
        {
            if (await _db.Campuses.Where(x => x.Name == campus.Name ).AnyAsync())
            {
                throw new Exception("Campus already exists.");
            }
        }

       
        public async Task<int> CreateCampus(Campus campus)
        {
            await ValidateCampus(campus);
            _db.Campuses.Add(campus);
            await _db.SaveChangesAsync();
            await _db.SaveChangesAsync();
            return campus.Id;
        }

        public async Task DeleteCampus(int campusId)
        {
            Campus campus = await _db.Campuses.SingleOrDefaultAsync(x => x.Id == campusId) ??
                                throw new Exception("Can't find campus to delete.");

            if (await _db.Qualifications.FirstOrDefaultAsync(x => x.NqfLevelId == campusId) != null)
                throw new Exception(
                    "Can not delete this Campus . Please change modules which is linked to it first.");
            _db.Campuses.Remove(campus);
            await _db.SaveChangesAsync();
        }
        #endregion
    }
}
