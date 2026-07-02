using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services
{
    public interface IOpenRouteService
    {
        Task<(decimal distance, int time, string geoJson)> GetRouteDataAsync(double startLng, double startLat, double endLng, double endLat, string profile = "driving-car");
        Task<(double Lng, double Lat)> GetCoordinatesAsync(string address);
    }
}