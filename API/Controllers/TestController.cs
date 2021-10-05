using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Contracts.Requests;
using Domain.Enums;
using Domain.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]"), ApiController]
    public class TestController : ControllerBase
    {
        // GET
        [HttpGet, AllowAnonymous]
        public async Task<Response<bool>> Test()
        {
            return new Response<bool>()
            {
                IsSuccessful = false,
                Errors = new List<ResponseException>()
                {
                    new ResponseException(ExceptionType.InputNotValid, "invalid input","Username"),
                    new ResponseException(ExceptionType.NotFound, "invalid input")

                }

            };
        }
        [HttpPost,AllowAnonymous]
        public async Task<Response<bool>> Test(LoginRequest request)
        {
            return new Response<bool>();
        }

    }
}