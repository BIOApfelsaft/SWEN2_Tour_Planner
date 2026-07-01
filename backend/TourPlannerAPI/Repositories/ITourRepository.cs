using TourPlannerAPI.Models;

namespace TourPlannerAPI.Repositories
{
    public interface ITourRepository
    {
        Task<IEnumerable<Tour>> GetAllToursAsync();
        Task<Tour?> GetTourByIdAsync(int id);
        Task<Tour> CreateTourAsync(Tour tour);
        Task UpdateTourAsync(Tour tour);
        Task DeleteTourAsync(int id);
    }
}