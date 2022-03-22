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

    public class ActivitiesController : ODataController
    {

        #region private fields
        private readonly DataContext _db;
        private readonly IActivityService _service;
        private readonly IMapper _mapper;
        #endregion


        public ActivitiesController(DataContext db, IActivityService service, IMapper mapper)
        {
            _db = db;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("{id}"), EnableQuery]
        public async Task<ActionResult> Get(int id)
        {

            var data = SingleResult.Create(_db.Activities.Where(x => x.Id == id));
            return Ok(data);
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_db.Activities);
        }

        [EnableQuery, HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteActivity(id);
                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ActivityCreateRequest activity)
        {
            try
            {

                return Ok(await _service.CreateActivity(_mapper.Map<Activity>(activity)));
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody] ActivityUpdateRequest data)
        {
            try
            {
                Activity activity = await _db.Activities.SingleOrDefaultAsync(x => x.Id == id);
                if (activity == null)
                    return ODataErrorResult("404", "Could not find item");
                if (activity.Name != data.Name)
                {
                    activity.Name = data.Name;
                    await _service.ValidateActivity(activity);

                }

                activity.Description = data.Description;

                activity.Active = data.Active;
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
