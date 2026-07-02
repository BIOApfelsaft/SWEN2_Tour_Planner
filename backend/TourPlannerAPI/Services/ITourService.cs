using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services
{
    public interface ITourService
    {
        Task<IEnumerable<Tour>> GetAllToursAsync();
        Task<Tour?> GetTourByIdAsync(int id);
        Task<Tour> CreateTourAsync(Tour tour, double startLng, double startLat, double endLng, double endLat);
        Task<Tour?> UpdateTourAsync(int id, Tour updatedData, double startLng, double startLat, double endLng, double endLat);
        Task DeleteTourAsync(int id);
    }
}