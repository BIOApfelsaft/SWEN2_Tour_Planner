using TourPlannerAPI.DTOs.Weather;

namespace TourPlannerAPI.Services;

public interface IWeatherService
{
    Task<WeatherResponse> GetWeatherAsync(string location);
}