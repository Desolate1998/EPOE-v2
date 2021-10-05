using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
namespace Domain.Models.Database
{
    [Table("Users")]
    public class User: IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
