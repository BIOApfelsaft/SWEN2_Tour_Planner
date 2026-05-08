using TourPlannerAPI.Models;

public interface ITourLogService
{
    Task<IEnumerable<TourLog>> GetTourLogsAsync(int tourId);
    Task<TourLog> GetTourLogByIdAsync(int id);
    Task AddTourLogAsync(TourLog tourLog);
    Task UpdateTourLogAsync(TourLog tourLog);
    Task DeleteTourLogAsync(int id);
}