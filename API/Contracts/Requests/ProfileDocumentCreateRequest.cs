using Microsoft.AspNetCore.Http;

namespace Api.Contracts.Requests;

public class ProfileDocumentCreateRequest
{
    public int ProfileDocumentTypeId { get; set; }
    public IFormFile ProfileDocument{ get; set; }
}
