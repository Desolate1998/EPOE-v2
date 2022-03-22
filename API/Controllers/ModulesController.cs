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

    public class ModulesController : ODataController
    {

        #region private fields
        private readonly DataContext _db;
        private readonly IModuleService _service;
        private readonly IMapper _mapper;
        #endregion


        public ModulesController(DataContext db, IModuleService service, IMapper mapper)
        {
            _db = db;
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("{id}"), EnableQuery]
        public async
            Task<ActionResult> Get(int id)
        {

            var data = SingleResult.Create(_db.Modules.Where(x => x.Id == id));
            return Ok(data);
        }

        [EnableQuery, HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_db.Modules);
        }

        [EnableQuery, HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteModule(id);

                return Ok();
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ModuleCreateRequest module)
        {
            try
            {

                return Ok(await _service.CreateModule(_mapper.Map<Module>(module)));
            }
            catch (Exception e)
            {
                return ODataErrorResult("403", e.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody] ModuleUpdateRequest data)
        {
            try
            {
                Module module = await _db.Modules.SingleOrDefaultAsync(x => x.Id == id);
                if (module == null)
                    return ODataErrorResult("404", "Could not find item");
                if (module.Name != data.Name)
                {
                    module.Name = data.Name;
                    await _service.ValidateModule(module);
       
                }
                   
                module.Description = data.Description;

                module.Active = data.Active;
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
