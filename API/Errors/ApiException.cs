using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiException : ApiResponse
    {
        public ApiException(int statusCode, string message = null, string Details = null) : base(statusCode, message)
        {
            StackTrace = Details;
        }

        public string StackTrace { get; set; }


    }
}