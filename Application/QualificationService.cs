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

    public interface IQualificationService
    {
        Task ValidateQualification(Qualification nqfLevel);
        Task<int> CreateQualification(Qualification nqfLevel);
        Task DeleteQualification(int nqfLevelId);
    }



    #endregion


    public class QualificationService:IQualificationService
    {
        #region private fields
        private readonly DataContext _db;


        #endregion
        #region Constructor

        public QualificationService(DataContext db)
        {
            _db = db;
        }

        #endregion

        #region Public Methods
        public async Task ValidateQualification(Qualification qualification)
        {
            if (await _db.Qualifications.Where(x => x.Name == qualification.Name).AnyAsync())
            {
                throw new Exception("Qualification level already exists");
            }
        }

        public async Task<int> CreateQualification(Qualification qualification)
        {
            await ValidateQualification(qualification);
            _db.Qualifications.Add(qualification);
            await _db.SaveChangesAsync();
            await _db.SaveChangesAsync();
            return qualification.Id;

        }

        public async Task DeleteQualification(int id)
        {
          
                Qualification qualification = await _db.Qualifications.SingleOrDefaultAsync(x => x.Id == id) ??
                                    throw new Exception("Can't find qualification to delete.");
                qualification.Active = false;
                await _db.SaveChangesAsync();
        }
        #endregion
    }
}
