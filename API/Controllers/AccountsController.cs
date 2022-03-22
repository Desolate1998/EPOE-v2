
using Api.Contracts.Requests;
using API.Services;
using AutoMapper;
using Domain.Data_Transfer_Objects;
using Domain.Models.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Api.Controllers
{
    [Route("api/[controller]"), ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class AccountsController : ControllerBase
    {

        #region Private Fields
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly TokenServices _tokenServices;
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;


        #endregion

        #region Constructors

        public AccountsController(RoleManager<IdentityRole> roleM ,UserManager<User> userManager, SignInManager<User> signInManager, TokenServices tokenServices, IMapper mapper, DataContext dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenServices = tokenServices;
            _mapper = mapper;
            _dbContext = dbContext;
            _roleManager = roleM;
        }




        #endregion


        [HttpPost("loginTest"), AllowAnonymous]
        public async Task<ActionResult> LoginTest()
        {
            User user = await _userManager.FindByEmailAsync("ruandejongh@outlook.com");

            try
            {
                SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, "Password1",
                 false);

                if (result.Succeeded)
                {
                    await _dbContext.Logins.AddAsync(new LoginLog
                    {
                        UserId = user.Id,
                        LoginDate = System.DateTime.Now,
                    });
                    _dbContext.SaveChanges();
                    string t = await _tokenServices.CreateToken(user);
                    return Ok(t);


                }
                return BadRequest("Email or Password was incorrect");
            }
            catch (System.Exception e)
            {

                throw;
            }
         

        }

        #region EndPoints


        [HttpPost("login"), AllowAnonymous]
        public async Task<ActionResult> Login([FromBody] LoginRequest loginInfo)
        {
            User user = await _userManager.FindByEmailAsync(loginInfo.Email);
            if (user == null)
                return BadRequest("Email or Password was incorrect");

            SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, loginInfo.Password,
                    false);

            if (result.Succeeded)
            {
                await _dbContext.Logins.AddAsync(new LoginLog
                {
                    UserId = user.Id,
                    LoginDate = System.DateTime.Now,
                });
                _dbContext.SaveChanges();
                var t = await _tokenServices.CreateToken(user);
                return Ok(new AuthenticationInformation()
                {
                    UserType = user.UserType,
                    Token = t,
                    FullName = user.ToString(),
                    id =user.Id,
                    ProfilePicture=user.ProfilePicture,
                });

            }
            return BadRequest("Email or Password was incorrect");

        }


        [HttpPost("register"), AllowAnonymous]
        public async Task<IActionResult> Register()
        {

            IdentityResult results = await _userManager.CreateAsync(new Domain.Models.Database.User() { Email = "ruandejongh@outlook.com", UserName = "ruandejongh@outlook.com" ,UserType=Domain.Enums.UserTypes.Admin}, "Password1");
            return Ok();
        }


        [HttpPost("TestAccess"),Authorize(Roles = "can_edit_roles")]
        public async Task<IActionResult> TestAccess()
        {
            
            return Ok("Test");
        }

        [HttpPost("addRole")]
        public async Task<IActionResult> AddRole([FromQuery]string role)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
            IdentityRole _role = new IdentityRole();
            _role.Name = role;
            _role.NormalizedName = role;
           var res = await  _roleManager.CreateAsync(_role);
            return Ok();
        }


        [HttpPost("addUSerToRole"), AllowAnonymous]
        public async Task<IActionResult> AddUSerToRole([FromQuery] string userRole)
        {
            var user = await _userManager.FindByEmailAsync("ruandejongh@outlook.com");
            var roles = await _roleManager.Roles.ToListAsync();
            var role = await _roleManager.Roles.Where(x=>x.Name==userRole).FirstOrDefaultAsync();
           await _userManager.AddToRoleAsync(user, userRole);
            return Ok();
        }

        [HttpGet("AutoLogin")]
        public async Task<IActionResult> AutoLogin()
        {

            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
            var user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Email == email);
            await _dbContext.Logins.AddAsync(new LoginLog
            {
                UserId = user.Id,
                LoginDate = System.DateTime.Now,
            });
            await _dbContext.SaveChangesAsync();
            return Ok();
        }



        #endregion



    }
}
