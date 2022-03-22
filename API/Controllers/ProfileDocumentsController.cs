using Api.Contracts.Requests;
using Application;
using AutoMapper;
using Domain.Models.Database;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using System.Linq;
using API.Services;
using System.Security.Claims;
using System.Collections.Generic;
using Domain.Data_Transfer_Objects;
using Microsoft.AspNetCore.Http;

namespace Api.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]"), ApiController]

    public class ProfileDocumentsController : ODataController
    {

        #region private fields
        private readonly DataContext _db;
        private readonly IProfileDocumentService _service;
        private readonly IMapper _mapper;
        private readonly TokenServices _tokenServices;
        #endregion


        public ProfileDocumentsController(DataContext db, IProfileDocumentService service, IMapper mapper, TokenServices tokenServices)
        {
            _db = db;
            _service = service;
            _mapper = mapper;
            _tokenServices = tokenServices;
        }

        [HttpGet("{id}"), EnableQuery]
        public async Task<ActionResult> Get(int id)
        {

            var data = SingleResult.Create(_db.ProfileDocuments.Where(x => x.Id == id));
            return Ok(data);
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_db.ProfileDocuments);
        }

        [EnableQuery, HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteProfileDocument(id);

                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ProfileDocumentCreateRequest profileDocument)
        {
            try
            {
                var token = HttpContext.Request.Headers["Authorization"];
                var email = _tokenServices.GetClaims(token).Claims.
                                SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
                await _service.CreateProfileDocument(profileDocument.ProfileDocument, email, profileDocument.ProfileDocumentTypeId);
                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody] ProfileDocumentUpdateRequest data)
        {
            try
            {
                ProfileDocument profileDocument = await _db.ProfileDocuments.SingleOrDefaultAsync(x => x.Id == id);
                if (profileDocument == null)
                    return ODataErrorResult("404", "Could not find item");


                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception)
            {
                return ODataErrorResult("403", "Name is already in use.");
            }

        }

        [HttpGet("GetProfileDocumentInfo")]
        public async Task<List<StudentProfileDocumentInfo>> GetProfileDocumentInfo()
        {

            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
           return await _service.GetStudentProfileDocuments(email);
         
        }
        [HttpGet("GetProfileDocumentInfo/{id}")]
        public async Task<List<StudentProfileDocumentInfo>> GetProfileDocumentInfo([FromRoute]string id)
        {
            var user = await _db.Users.SingleOrDefaultAsync(x=>x.Id==id);
            return await _service.GetStudentProfileDocuments(user.Email);

        }

        [HttpPost("UploadProfileDocument")]
        public async Task<int> UploadProfileDocument([FromForm]IFormFile file, [FromForm] string profileDocumentTypeId)
        {
            var token = HttpContext.Request.Headers["Authorization"];
            var email = _tokenServices.GetClaims(token).Claims.
                            SingleOrDefault(claim => claim.Type == ClaimTypes.Email).Value;
            var user = _db.Users.SingleOrDefault(x=>x.Email==email);
            return await _service.UploadProfileDocument(file, int.Parse(profileDocumentTypeId), user);
        }

        
    }
}
