using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ErrorResponseTestController : BaseApiController
    {
        private readonly StoreContext _context;
        public ErrorResponseTestController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("notFound")]

        public ActionResult GetNotFoundRequest ()
        {
            var nullObject = _context.Products.Find(100);

            if (nullObject == null) return NotFound(new ApiResponse(404));
        
            return Ok() ;
        }

        [HttpGet("serverError")]

        public ActionResult GetServerError ()
        {
            var testObject = _context.Products.Find(100);

            var nullObject = testObject.ToString();

            return Ok() ;
        }

        [HttpGet("badRequest")]

        public ActionResult GetBadRequest ()
        {
           return BadRequest(new ApiResponse(400)) ;
        }

        [HttpGet("badRequest/{id}")]

        public ActionResult GetNotFoundRequest (int id)
        {
           return Ok() ;
        }

    }
}