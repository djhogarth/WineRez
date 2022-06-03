using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
   [Route("errors/{errorCode}")]
   public class ErrorController : BaseApiController
    {
        public IActionResult Error(int errorCode)
        {
            return new ObjectResult(new ApiResponse(errorCode));
        }
        
    }
}