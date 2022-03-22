using System.ComponentModel.DataAnnotations;

namespace Api.Contracts.Requests
{
    public class NqfLevelUpdateRequest
    {
        [Required]
        public string Name { get; set; }


    }
}