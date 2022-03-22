using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Database
{
    public class LoginLog
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime LoginDate { get; set; }

        public User User { get; set; }  
    }
}
