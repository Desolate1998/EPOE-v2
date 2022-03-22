using Domain.Enums;

namespace Api.Contracts.Requests
{
    public class UserCreateRequest
    {
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        //public string Username { get; set; }
        public UserTypes UserType { get; set; }
    }
}   