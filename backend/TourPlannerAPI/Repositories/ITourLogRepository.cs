using TourPlannerAPI.Models;

public interface ITourLogRepository
{
    Task<IEnumerable<TourLog>> GetTourLogsAsync(int tourId);
    Task<TourLog> GetTourLogByIdAsync(int id);
    Task AddTourLogAsync(TourLog tourLog);
    Task UpdateTourLogAsync(TourLog tourLog);
    Task DeleteTourLogAsync(int id);
}