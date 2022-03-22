using Api.Contracts.Requests;
using API.Services;
using Application;
using AutoMapper;
using Domain.Data_Transfer_Objects;
using Domain.Enums;
using Domain.Models.Database;
using Domain.Utilities;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]"), ApiController]
    public class UsersController : ODataController
    {
        #region private fields
        private readonly DataContext _db;
        private readonly IUserService _service;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenServices _tokenServices;

        private readonly IMapper _mapper;

        #endregion


        public UsersController(DataContext db, IUserService service, UserManager<User> userManager, SignInManager<User> signInManager, TokenServices tokenServices, IMapper mapper)
        {
            _db = db;
            _service = service;
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenServices = tokenServices;
            _mapper = mapper;
        }


        [HttpGet("Get{key}")]
        public async Task<IActionResult> Get(string key)
        {
            return Ok(await _db.Users.SingleOrDefaultAsync(x => x.Id == key));
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _db.Users.Where(x => x.Active).ToListAsync());
        }

        [EnableQuery, HttpDelete]
        public async Task<IActionResult> Delete(string key)
        {
            await _service.DeleteUser(key);
            return Ok();
        }
        [EnableQuery, HttpPost, AllowAnonymous]
        public async Task<IActionResult> Post([FromBody] UserCreateRequest user)
        {

            var userToAdd = _mapper.Map<User>(user);
            await _service.CreateUser(userToAdd, null);
            return Ok();
        }
        [HttpGet("GetUserLoginsStatisticsInformation"), EnableQuery]
        public async Task<IActionResult> GetUserLoginsStatisticsInformation()
        {
            var Data = await _service.GetUserLoginsStatisticsInformation();
            return Ok(Data);

        }


        [HttpGet("GetUserInRole"), EnableQuery]
        public async Task<IActionResult> UserInRole([FromQuery] UserTypes role, [FromQuery] bool count = false)
        {
            var data = await _db.Users.Select(u => new UserInformation()
            {
                Active = u.Active,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Logins = u.Logins,
                UserType = u.UserType,
                Id = u.Id,


            }).ToArrayAsync();
            if (count)
                return Ok(data.Where(x => x.UserType == role & x.Active).Count());
            return Ok(data.Where(x => x.UserType == role & x.Active));

        }

        [HttpPost("ProfileImageUpload")]
        public async Task<IActionResult> UploadProfileImage([FromForm] IFormFile image)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
            var user = await _db.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (user.ProfilePicture == null) await RemoveProfilePicture();
            string name = await new FileHandler().SaveFile(FilesPaths.ProfilePictures, image, user.Id);
            user.ProfilePicture = name;
            _db.SaveChanges();
            return Ok(name);
        }


        [HttpPost("RemoveProfilePicture")]
        public async Task<IActionResult> RemoveProfilePicture()
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
            var user = await _db.Users.SingleOrDefaultAsync(x => x.Email == email);
            new FileHandler().DeleteFile(FilesPaths.ProfilePictures, user.ProfilePicture);
            user.ProfilePicture = null;
            _db.SaveChanges();
            return Ok();
        }

        [HttpGet("Me")]
        public async Task<IActionResult> Me()
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
            var user = await _db.Users.SingleOrDefaultAsync(x => x.Email == email);
            return Ok(new UserInformation()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserType = user.UserType,
                Id = user.Id,
                Email = email,
                ProfilePicture = user.ProfilePicture,
            });
        }

        [HttpPost("UpdatePassword")]
        public async Task<IActionResult> UpdatePassword([FromForm] string password)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
            var user = await _userManager.FindByEmailAsync(email);
            var pwdtoken = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _userManager.ResetPasswordAsync(user, pwdtoken, password);
            return Ok();
        }
    }


}