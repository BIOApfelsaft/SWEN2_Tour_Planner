using System.Text;
using System.Text.Json;
using TourPlannerAPI.Models;

public class OpenRouteServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public OpenRouteServiceClient(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _apiKey = config["ORS:ApiKey"] ?? throw new ArgumentNullException("ORS ApiKey missing");
    }

    public async Task<(decimal distance, int time, string geoJson)> GetRouteDataAsync(double startLng, double startLat, double endLng, double endLat, string profile = "driving-car")
    {
        var url = $"https://api.openrouteservice.org/v2/directions/{profile}/geojson";
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", _apiKey);

        var payload = new
        {
            coordinates = new[]
            {
                new[] { startLng, startLat },
                new[] { endLng, endLat }
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(url, content);
        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(jsonResponse);
        
        var features = doc.RootElement.GetProperty("features")[0];
        var properties = features.GetProperty("properties");
        var summary = properties.GetProperty("summary");

        decimal distance = summary.GetProperty("distance").GetDecimal();
        int time = (int)summary.GetProperty("duration").GetDouble();
        string geoJson = features.GetProperty("geometry").GetRawText();

        return (distance, time, geoJson);
    }
}