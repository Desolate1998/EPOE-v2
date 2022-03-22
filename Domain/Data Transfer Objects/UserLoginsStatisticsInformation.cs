using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Data_Transfer_Objects
{
    public class UserLoginsStatisticsInformation
    {
        public int ThisMonth { get; set; }
        public int Today { get; set; }
        public int LastMonth { get; set; }
        public int CurrentUserCount { get; set; }


        
    }
}
