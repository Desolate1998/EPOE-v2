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

    public class CampusesController : ODataController
    {

        #region private fields
        private readonly DataContext _db;
        private readonly ICampusService _service;
        private readonly IMapper _mapper;
        #endregion


        public CampusesController(DataContext db, ICampusService service, IMapper mapper)
        {
            _db = db;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("{id}"), EnableQuery]
        public async Task<ActionResult> Get(int id)
        {

            var data = SingleResult.Create(_db.Campuses.Where(x => x.Id == id));
            return Ok(data);
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_db.Campuses);
        }

        [EnableQuery, HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteCampus(id);

                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] CampusCreateRequest campus)
        {
            try
            {

                return Ok(await _service.CreateCampus(_mapper.Map<Campus>(campus)));
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody] CampusUpdateRequest data)
        {
            try
            {
                Campus campus = await _db.Campuses.SingleOrDefaultAsync(x => x.Id == id);
                if (campus == null)
                    return ODataErrorResult("404", "Could not find item");
                if (campus.Name != data.Name)
                {
                    campus.Name = data.Name;
                    await _service.ValidateCampus(campus);

                }

                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", "Name is already in use.");
            }




        }

    }
}
