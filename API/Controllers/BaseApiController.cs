using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /*  This class houses common code across controllers.
        Other controllers can inherit from this class to limit the re-typing of code */

    [ApiController]
    [Route("api/[controller]")]
    
    public class BaseApiController : ControllerBase
    {
        
    }
}