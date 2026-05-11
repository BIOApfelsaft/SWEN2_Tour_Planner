using TourPlannerAPI.Models;

public class TourLogService : ITourLogService
{
    private readonly ILogger<TourLogService> _logger;
    private readonly ITourLogRepository _tourLogRepository;

    public TourLogService(ILogger<TourLogService> logger, ITourLogRepository tourLogRepository)
    {
        _logger = logger;
        _tourLogRepository = tourLogRepository;
    }

    public async Task<IEnumerable<TourLog>> GetTourLogsAsync(int tourId)
    {
        _logger.LogInformation("Fetching tour logs for tour ID: {TourId}", tourId);
        return await _tourLogRepository.GetTourLogsAsync(tourId);
    }

    public async Task<TourLog> GetTourLogByIdAsync(int id)
    {
        _logger.LogInformation("Fetching tour log by ID: {Id}", id);
        return await _tourLogRepository.GetTourLogByIdAsync(id);
    }

    public async Task AddTourLogAsync(TourLog tourLog)
    {
        _logger.LogInformation("Adding new tour log.");
        await _tourLogRepository.AddTourLogAsync(tourLog);
    }

    public async Task UpdateTourLogAsync(TourLog tourLog)
    {
        _logger.LogInformation("Updating tour log.");
        await _tourLogRepository.UpdateTourLogAsync(tourLog);
    }

    public async Task DeleteTourLogAsync(int id)
    {
        _logger.LogInformation("Deleting tour log by ID: {Id}", id);
        await _tourLogRepository.DeleteTourLogAsync(id);
    }
}   