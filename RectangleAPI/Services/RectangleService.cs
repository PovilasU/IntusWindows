using System.Text.Json;
using RectangleAPI.Models;

namespace RectangleAPI.Services
{
    public class RectangleService
    {
        private const string JsonFilePath = "rectangle.json";

        public RectangleDto GetDimensions()
        {
            if (!File.Exists(JsonFilePath)) return new RectangleDto { Width = 100, Height = 50 };
            var json = File.ReadAllText(JsonFilePath);
            return JsonSerializer.Deserialize<RectangleDto>(json);
        }

        public void SaveDimensions(RectangleDto rectangle)
        {
            var json = JsonSerializer.Serialize(rectangle);
            File.WriteAllText(JsonFilePath, json);
        }
    }
}
