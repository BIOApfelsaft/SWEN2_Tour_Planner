using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services;

public interface IWeatherService
{
    Task<Weather> GetWeatherAsync(string location);
}