using System.Globalization;
using System.Text.Json;
using TourPlannerAPI.DTOs.Weather;

namespace TourPlannerAPI.Services;

public class WeatherService(HttpClient httpClient, IOpenRouteService openRouteService) : IWeatherService
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly IOpenRouteService _openRouteService = openRouteService;

    public async Task<WeatherResponse> GetWeatherAsync(string location)
    {
        var (lng, lat) = await _openRouteService.GetCoordinatesAsync(location);

        string latStr = lat.ToString(CultureInfo.InvariantCulture);
        string lngStr = lng.ToString(CultureInfo.InvariantCulture);

        var url = $"https://api.open-meteo.com/v1/forecast?latitude={latStr}&longitude={lngStr}&current_weather=true";
        
        var response = await _httpClient.GetAsync(url);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new Exception($"Open-Meteo API failed with {response.StatusCode}: {errorBody}");
        }

        var jsonResponse = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(jsonResponse);
        
        var current = doc.RootElement.GetProperty("current_weather");
        double temp = current.GetProperty("temperature").GetDouble();
        int code = current.GetProperty("weathercode").GetInt32();

        var (condition, icon) = MapWeatherCode(code);

        return new WeatherResponse
        {
            Temperature = temp,
            Condition = condition,
            Icon = icon
        };
    }

    private static (string Condition, string Icon) MapWeatherCode(int code)
    {
        return code switch
        {
            0 => ("Clear", "sunny"),
            1 or 2 => ("Partly Cloudy", "partly_cloudy_day"),
            3 => ("Overcast", "cloud"),
            >= 45 and <= 48 => ("Fog", "foggy"),
            (>= 51 and <= 67) or (>= 80 and <= 82) => ("Rain", "rainy"),
            (>= 71 and <= 77) or (>= 85 and <= 86) => ("Snow", "snowing"),
            >= 95 and <= 99 => ("Storm", "thunderstorm"),
            _ => ("Unknown", "device_thermostat")
        };
    }
}