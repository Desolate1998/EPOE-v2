using System;
using System.Linq;
using System.Threading.Tasks;
using Domain.Data_Transfer_Objects;
using Domain.Enums;
using Domain.Models.Database;
using Domain.Models.ExtraDetails;
using Domain.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistent;

namespace Application
{
    #region Interface

    public interface IUserService
    {
        Task ValidateUser(User user);
        Task<string> CreateUser(User user, UserCreateDetails userCreateDetails);
        Task DeleteUser(string userId);
        Task<UserLoginsStatisticsInformation> GetUserLoginsStatisticsInformation();
    }



    #endregion
    public class UserService:IUserService
    {
        #region private fields
        private readonly DataContext _db;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        #endregion
        #region Constructor

        public UserService(DataContext db,UserManager<User> um)
        {
            _db = db;
            _userManager = um;
        }

        #endregion
        #region Public Methods
        public async Task ValidateUser(User user)
        {
            if (await _db.Users.SingleOrDefaultAsync(x => x.Email == user.Email) != null)
                throw new ResponseException(ExceptionType.Conflicting, "User email already in use");
        }

        public async Task<string> CreateUser(User user, UserCreateDetails userCreateDetails)
        {
            await ValidateUser(user);
            string guid = Guid.NewGuid().ToString();
            user.UserName = guid;
            user.Active = true;
#if DEBUG
            await _userManager.CreateAsync(user, "SecurePassword123");

#else
            await _userManager.CreateAsync(user, guid);

#endif
            //user.UserName = user.Email;
            //_db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user.Id;
        }

        public async Task DeleteUser(string userId)
        {
            User user = await _db.Users.SingleOrDefaultAsync(x => x.Id == userId) ??
                        throw new ResponseException(ExceptionType.NotFound, "Can't find user to delete.");
            _db.Remove(user);
            await _db.SaveChangesAsync();

        }


        public async Task<UserLoginsStatisticsInformation> GetUserLoginsStatisticsInformation()
        {
            UserLoginsStatisticsInformation userLoginsStatisticsInformation = new UserLoginsStatisticsInformation();
            userLoginsStatisticsInformation.Today = await _db.Logins.Select(x=>x.LoginDate==new DateTime(DateTime.Today.Year,DateTime.Today.Month,DateTime.Today.Day)).CountAsync();
            
            var startOfTthisMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
            var firstDay = startOfTthisMonth.AddMonths(-1);
            var lastDay = startOfTthisMonth.AddDays(-1);
           
            userLoginsStatisticsInformation.LastMonth = await _db.Logins.Where(x => firstDay>= x.LoginDate && x.LoginDate <= lastDay ).CountAsync();
            
            var lastDayOfMonth = DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month);
            userLoginsStatisticsInformation.ThisMonth= await _db.Logins.Select(x => firstDay >= x.LoginDate && x.LoginDate <= lastDay).CountAsync();

          

           userLoginsStatisticsInformation.CurrentUserCount = await _db.Users.Select(x => x.Active).CountAsync();
            return userLoginsStatisticsInformation;
        }
#endregion
    }
}