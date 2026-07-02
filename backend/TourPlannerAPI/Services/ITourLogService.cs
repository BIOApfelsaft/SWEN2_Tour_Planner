using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services;

public interface ITourLogService
{
    Task<IEnumerable<TourLog>> GetTourLogsAsync(int tourId);
    Task<TourLog?> GetTourLogByIdAsync(int id);
    Task<TourLog> AddTourLogAsync(TourLog log);
    Task<bool> UpdateTourLogAsync(TourLog updatedLog);
    Task DeleteTourLogAsync(int id);
}