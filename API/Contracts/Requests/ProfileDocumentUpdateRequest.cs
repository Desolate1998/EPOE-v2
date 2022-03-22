using Microsoft.AspNetCore.Http;

namespace Api.Contracts.Requests;

public class ProfileDocumentUpdateRequest 
{
    public int ProfileDocumentId { get; set; }
    public IFormFile ProfileDocument { get; set; }
}
