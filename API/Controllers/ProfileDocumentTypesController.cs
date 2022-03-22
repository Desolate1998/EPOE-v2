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
using System.Linq;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]"), ApiController]

    public class ProfileDocumentTypesController : ODataController
    {
         #region private fields
        private readonly DataContext _db;
        private readonly IProfileDocumentTypeService _service;
        private readonly IMapper _mapper;
        #endregion


        public ProfileDocumentTypesController(DataContext db, IProfileDocumentTypeService service, IMapper mapper)
        {
            _db = db;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("{id}"), EnableQuery]
        public async Task<ActionResult> Get(int id)
        {

            var data = SingleResult.Create(_db.ProfileDocumentTypes.Where(x => x.Id == id));
            return Ok(data);
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_db.ProfileDocumentTypes);
        }

        [EnableQuery, HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteProfileDocumentType(id);
                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ProfileDocumentTypeCreateRequest profileDocumentType)
        {
            try
            {

                return Ok(await _service.CreateProfileDocumentType(_mapper.Map<ProfileDocumentType>(profileDocumentType)));
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody] ProfileDocumentTypeUpdateRequest data)
        {
            try
            {
                ProfileDocumentType profileDocumentType = await _db.ProfileDocumentTypes.SingleOrDefaultAsync(x => x.Id == id);
                if (profileDocumentType == null)
                    return ODataErrorResult("404", "Could not find item");
                if (profileDocumentType.Name != data.Name)
                {
                    profileDocumentType.Name = data.Name;
                    await _service.ValidateProfileDocumentType(profileDocumentType);

                }

                profileDocumentType.Description = data.Description;

                profileDocumentType.Active = data.Active;
                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception)
            {
                return ODataErrorResult("403", "Name is already in use.");
            }

        }
    }
}
