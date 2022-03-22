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

    public class NqfLevelsController : ODataController
    {

        #region private fields
        private readonly DataContext _db;
        private readonly INqfLevelService _service;
        private readonly IMapper _mapper;
        #endregion


        public NqfLevelsController(DataContext db, INqfLevelService service, IMapper mapper)
        {
            _db = db;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("{id}"),EnableQuery]
        public async 
            Task<ActionResult> Get(int id)
        {

                var data = SingleResult.Create(_db.NqfLevels.Where(x=>x.Id==id));
                return  Ok(data);
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_db.NqfLevels);
        }

        [EnableQuery, HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteNqfLevel(id);

                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] NqfLevelCreateRequest nqfLevel)
        {
            try
            {
               
                return Ok(await _service.CreateNqfLevel(_mapper.Map<NqfLevel>(nqfLevel)));
            }
            catch (Exception e)
            {
                return ODataErrorResult("403",e.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id,[FromBody] NqfLevelUpdateRequest data)
        {
            try
            {
                NqfLevel nqfLevel = await _db.NqfLevels.SingleOrDefaultAsync(x => x.Id == id);
                if(nqfLevel==null)
                    return ODataErrorResult("404", "Could not find item");
                nqfLevel.Name= data.Name;
                
                await _service.ValidateNqfLevel(nqfLevel);

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
