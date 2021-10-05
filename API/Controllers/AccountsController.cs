using Api.Contracts.Requests;
using API.Services;
using AutoMapper;
using Domain.Models.Database;
using Domain.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using Domain.Enums;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Api.Controllers
{
    [Route("api/[controller]"), ApiController]
    public class AccountsController : ControllerBase
    {

        #region Private Fields
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenServices _tokenServices;
        private readonly IMapper _mapper;


        #endregion

        #region Constructors

        public AccountsController(UserManager<User> userManager, SignInManager<User> signInManager, TokenServices tokenServices, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenServices = tokenServices;
            _mapper = mapper;
        }




        #endregion


        #region EndPoints

       
        [HttpPost("login"), AllowAnonymous]
        public async Task<ActionResult<Response<string>>> Login([FromBody] LoginRequest loginInfo)
        {
            User user = await _userManager.FindByEmailAsync(loginInfo.Email);
            if (user == null)
                return new ActionResult<Response<string>>(new Response<string>()
                {
                    IsSuccessful = false,
                    Errors = new List<ResponseException>()
                    {
                        new ResponseException(ExceptionType.InputNotValid , "Incorrect Email Or Password")
                    }
                });

            SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, loginInfo.Password,
                    false);

            if (result.Succeeded)
            { 

                return new Response<string>()
                {
                    Data = _tokenServices.CreateToken(user),
                    IsSuccessful = true

                };
            }

            return new ActionResult<Response<string>>(new Response<string>()
            {
                IsSuccessful = false,
                Errors = new List<ResponseException>()
                {
                    new ResponseException(ExceptionType.InputNotValid, "Incorrect Email Or Password")
                }
            });
        }


        [HttpPost("register"), AllowAnonymous]
        public async Task<ActionResult<Response<bool>>> Register([FromBody] RegisterRequest data)
        {

            if (await _userManager.Users.AnyAsync(x => x.Email == data.Email))
                return new Response<bool>()
                {
                    Errors = new List<ResponseException>() { new ResponseException(ExceptionType.InputNotValid, "Email Already In User") },
                    IsSuccessful = false
                };
            User user = _mapper.Map<User>(data);
            IdentityResult results = await _userManager.CreateAsync(user, data.Password);
            if (results.Succeeded)
            {
                return new Response<bool>()
                {
                    IsSuccessful = true,
                    Data = true
                };
            }

            List<ResponseException> exceptions = results.Errors.Select(identityError =>
                new ResponseException(ExceptionType.InputNotValid, identityError.Description)).ToList();
            return new Response<bool>()
            {
                Errors = exceptions,
                IsSuccessful = false
            };
        }
        #endregion



    }
}
