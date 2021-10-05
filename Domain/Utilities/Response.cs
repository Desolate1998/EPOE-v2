using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Utilities
{
    /// <summary>
    /// Each Request type returns a response which data
    /// </summary>
    /// <typeparam name="TData"></typeparam>

    public class Response<TData>
    {
        public TData Data { get; set; }
        public bool IsSuccessful { get; set; }
        public List<ResponseException> Errors { get; set; }
    }
}
