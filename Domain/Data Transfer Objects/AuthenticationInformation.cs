using Domain.Enums;

namespace Domain.Data_Transfer_Objects
{
    public class AuthenticationInformation
    {
        public string id { get; set; }
        public string Token { get; set; }
        public string FullName { get; set; }
        public string ProfilePicture { get; set; }
        public UserTypes UserType { get; set; }
    }
}