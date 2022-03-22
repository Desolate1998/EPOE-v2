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

namespace Api.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]"), ApiController]
    public class QualificationsController : ODataController
    {

        #region private fields
        private readonly DataContext _db;
        private readonly IQualificationService _service;
        private readonly IMapper _mapper;
        #endregion


        public QualificationsController(DataContext db, IQualificationService service, IMapper mapper)
        {
            _db = db;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("{id}"), EnableQuery]
        public async Task<ActionResult> Get(int id)
        {
            var data = SingleResult.Create(_db.Qualifications.Where(x => x.Id == id));
            return Ok(data);
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_db.Qualifications);
        }

        [EnableQuery, HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteQualification(id);

                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] QualificationCreateRequest qualification)
        {
            try
            {

                return Ok(await _service.CreateQualification(_mapper.Map<Qualification>(qualification)));
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody]QualificationUpdateRequest data)
        {
            try
            {
                Qualification qualification= await _db.Qualifications.SingleOrDefaultAsync(x => x.Id == id);
                if (qualification == null)
                    return ODataErrorResult("404", "Could not find item");

                if (qualification.Name != data.Name)
                {
                    qualification.Name = data.Name;
                    await _service.ValidateQualification(qualification);

                }
                qualification.Name = data.Name;
                qualification.NqfLevelId = data.NqfLevelId;
                qualification.Active = data.Active;
                qualification.Description = data.Description;
                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }

        }

    }
}
