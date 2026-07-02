using System.Text;
using System.Text.Json;

namespace TourPlannerAPI.Services
{
    public class OpenRouteServiceClient(HttpClient httpClient, IConfiguration config) : IOpenRouteService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = config["ORS:ApiKey"] ?? throw new ArgumentNullException("ORS ApiKey missing");

        public async Task<(decimal distance, int time, string geoJson)> GetRouteDataAsync(double startLng, double startLat, double endLng, double endLat, string profile = "driving-car")
        {
            string orsProfile = MapToOrsProfile(profile);
            var url = $"https://api.openrouteservice.org/v2/directions/{orsProfile}/geojson";
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

            decimal distanceInMeters = summary.GetProperty("distance").GetDecimal();
            decimal distance = Math.Round(distanceInMeters / 1000, 2);
            int time = (int)summary.GetProperty("duration").GetDouble();
            string geoJson = features.GetProperty("geometry").GetRawText();

            return (distance, time, geoJson);
        }

        public async Task<(double Lng, double Lat)> GetCoordinatesAsync(string address)
        {
            var url = $"https://api.openrouteservice.org/geocode/search?api_key={_apiKey}&text={Uri.EscapeDataString(address)}";
            
            _httpClient.DefaultRequestHeaders.Clear();

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                throw new Exception($"Geocoding failed for address: {address}");

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            
            var features = doc.RootElement.GetProperty("features");
            if (features.GetArrayLength() == 0) 
                throw new Exception($"Ort nicht gefunden: {address}");
            
            var coords = features[0].GetProperty("geometry").GetProperty("coordinates");
            
            return (coords[0].GetDouble(), coords[1].GetDouble());
        }

        private static string MapToOrsProfile(string uiProfile)
        {
            return uiProfile.ToLower() switch
            {
                "car" => "driving-car",
                "mtb" => "cycling-mountain",
                "bicycle" => "cycling-regular",
                "hiking" => "foot-hiking",
                "walk" => "foot-walking",
                _ => "foot-hiking"
            };
        }
    }
}