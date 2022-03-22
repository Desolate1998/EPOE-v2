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

    public interface IActivityService
    {
        Task ValidateActivity(Activity activity);
        Task<int> CreateActivity(Activity activity);
        Task DeleteActivity(int activityId);
    }



    #endregion


    public class ActivityService : IActivityService
    {
        #region private fields
        private readonly DataContext _db;


        #endregion
        #region Constructor

        public ActivityService(DataContext db)
        {
            _db = db;
        }

        #endregion

        #region Public Methods
        public async Task ValidateActivity(Activity activity)
        {
            if (await _db.Activities.Where(x => x.Name == activity.Name && x.ModuleId== activity.ModuleId).AnyAsync())
            {
                throw new Exception("Activity already exists for this module.");
            }
        }

       
        public async Task<int> CreateActivity(Activity activity)
        {
            await ValidateActivity(activity);
            _db.Activities.Add(activity);
            await _db.SaveChangesAsync();
            await _db.SaveChangesAsync();
            return activity.Id;
        }

        public async Task DeleteActivity(int activityId)
        {
            Activity activity = await _db.Activities.SingleOrDefaultAsync(x => x.Id == activityId) ??
                                throw new Exception("Can't find activity to delete.");

            if (await _db.Qualifications.FirstOrDefaultAsync(x => x.NqfLevelId == activityId) != null)
                throw new Exception(
                    "Can not delete this Activity. Please change modules which is linked to it first.");
            _db.Activities.Remove(activity);
            await _db.SaveChangesAsync();
        }
        #endregion
    }
}
