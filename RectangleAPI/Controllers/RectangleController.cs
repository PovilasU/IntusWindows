using Microsoft.AspNetCore.Mvc;
using RectangleAPI.Models;
using RectangleAPI.Services;

namespace RectangleAPI.Controllers
{
    [ApiController]
    [Route("api/rectangle")]
    public class RectangleController : ControllerBase
    {
        private readonly RectangleService _service = new RectangleService();

        [HttpGet]
        public IActionResult GetDimensions()
        {
            return Ok(_service.GetDimensions());
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateDimensions([FromBody] RectangleDto rectangle)
        {
           // await Task.Delay(10000); // Simulate long processing
            await Task.Delay(2000); // Simulate long processing
            if (rectangle.Width > rectangle.Height)
                return BadRequest("Width cannot exceed height.");
            return Ok("Valid dimensions.");
        }

        [HttpPost("update")]
        public IActionResult UpdateDimensions([FromBody] RectangleDto rectangle)
        {
            _service.SaveDimensions(rectangle);
            return Ok();
        }
    }
}
