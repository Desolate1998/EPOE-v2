using Domain.Enums;
using Domain.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Data_Transfer_Objects
{
    public class UserInformation
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public UserTypes UserType { get; set; }

        public string Email { get; set; }
        public string ProfilePicture { get; set; }

        public bool Active { get; set; }
        public ICollection<LoginLog> Logins { get; set; }


        public override string ToString()
        {
            return FirstName + " " + LastName;
        }
    }
}
