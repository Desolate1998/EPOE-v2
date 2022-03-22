using Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistent;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]"), ApiController]
    public class FilesController : Controller
    {
        private readonly DataContext _db;
        private readonly IFileServices _service;

        public FilesController(DataContext db, IFileServices sevice)
        {
            _service = sevice;
            _db = db;
        }
        [HttpGet]
        public async Task<FileContentResult> DownloadFile([FromQuery]int Id)
        {
            var data = await _service.GetFile(Id);
            return File(data.Data, data.MimeType);
        }
    }
}
