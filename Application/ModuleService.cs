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

    public interface IModuleService
    {
        Task ValidateModule(Module module);
        Task<int> CreateModule(Module module);
        Task DeleteModule(int moduleId);
    }



    #endregion


    public class ModuleService : IModuleService
    {
        #region private fields
        private readonly DataContext _db;


        #endregion
        #region Constructor

        public ModuleService(DataContext db)
        {
            _db = db;
        }

        #endregion

        #region Public Methods
        public async Task ValidateModule(Module module)
        {
            if (await _db.Modules.Where(x => x.Name == module.Name && x.QualificationId==module.QualificationId).AnyAsync())
            {
                throw new Exception("Module already exists for this qualification.");
            }
        }

       
        public async Task<int> CreateModule(Module module)
        {
            await ValidateModule(module);
            _db.Modules.Add(module);
            await _db.SaveChangesAsync();

            return module.Id;

        }

        public async Task DeleteModule(int moduleId)
        {

            Module module = await _db.Modules.SingleOrDefaultAsync(x => x.Id == moduleId) ??
                                throw new Exception("Can't find module to delete.");

            if (await _db.Qualifications.FirstOrDefaultAsync(x => x.NqfLevelId == moduleId) != null)
                throw new Exception(
                    "Can not delete this Module . Please change qualifications which is linked to it first");
            _db.Modules.Remove(module);
            await _db.SaveChangesAsync();
        }
        #endregion
    }
}
