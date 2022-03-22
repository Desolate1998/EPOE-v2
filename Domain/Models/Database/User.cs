using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace Domain.Models.Database
{


    [Table("Users")]
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public UserTypes UserType { get; set; }
        public string ProfilePicture { get; set; }
        public bool Active { get; set; }
        public virtual ICollection<LoginLog> Logins { get; set; }
        public virtual ICollection<File> Files { get; set; }
        public virtual ICollection<ProfileDocument> ProfileDocuments { get; set; }
        public virtual ICollection<ExtraDocument> ExtraDocuments { get; set; }

        public override string ToString()
        {
            return FirstName + " " + LastName;
        }

    }
}
