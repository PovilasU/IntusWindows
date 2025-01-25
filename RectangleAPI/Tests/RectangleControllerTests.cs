using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RectangleAPI.Controllers;
using RectangleAPI.Models;
using Xunit;

namespace RectangleAPI.Tests
{
    public class RectangleControllerTests
    {
        [Fact]
        public async Task ValidateDimensions_ShouldReturnError_WhenWidthExceedsHeight()
        {
            var controller = new RectangleController();
            var rectangle = new RectangleDto { Width = 200, Height = 100 };

            var result = await controller.ValidateDimensions(rectangle);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task ValidateDimensions_ShouldReturnOk_WhenWidthDoesNotExceedHeight()
        {
            var controller = new RectangleController();
            var rectangle = new RectangleDto { Width = 100, Height = 200 };

            var result = await controller.ValidateDimensions(rectangle);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
