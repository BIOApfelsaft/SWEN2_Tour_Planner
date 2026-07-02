using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;

namespace TourPlannerAPI.Services;

public class TourLogService(
    ILogger<TourLogService> logger,
    ITourLogRepository tourLogRepository,
    ITourRepository tourRepository) : ITourLogService
{
    private readonly ILogger<TourLogService> _logger = logger;
    private readonly ITourLogRepository _tourLogRepository = tourLogRepository;
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<IEnumerable<TourLog>> GetTourLogsAsync(int tourId)
    {
        _logger.LogInformation("Fetching tour logs for tour ID: {TourId}", tourId);
        return await _tourLogRepository.GetTourLogsAsync(tourId);
    }

    public async Task<TourLog?> GetTourLogByIdAsync(int id)
    {
        _logger.LogInformation("Fetching tour log by ID: {Id}", id);
        return await _tourLogRepository.GetTourLogByIdAsync(id);
    }

    public async Task<TourLog> AddTourLogAsync(TourLog log)
    {
        _logger.LogInformation("Adding new tour log for TourId: {TourId}", log.TourId);
        
        log.CreatedAt = DateTime.Now;
        log.UpdatedAt = DateTime.Now;

        await _tourLogRepository.AddTourLogAsync(log);
        await RecalculateTourScoresAsync(log.TourId);
        
        return log;
    }

    public async Task<bool> UpdateTourLogAsync(TourLog updatedLog)
    {
        _logger.LogInformation("Updating tour log ID: {Id}", updatedLog.Id);
        
        updatedLog.UpdatedAt = DateTime.Now;

        await _tourLogRepository.UpdateTourLogAsync(updatedLog);
        await RecalculateTourScoresAsync(updatedLog.TourId);
        
        return true;
    }

    public async Task DeleteTourLogAsync(int id)
    {
        _logger.LogInformation("Deleting tour log by ID: {Id}", id);
        
        var tourLog = await _tourLogRepository.GetTourLogByIdAsync(id);
        if (tourLog != null)
        {
            int tourId = tourLog.TourId;
            await _tourLogRepository.DeleteTourLogAsync(id);
            await RecalculateTourScoresAsync(tourId);
        }
    }

    private async Task RecalculateTourScoresAsync(int tourId)
    {
        var logs = await _tourLogRepository.GetTourLogsAsync(tourId);
        var tour = await _tourRepository.GetTourByIdAsync(tourId);

        if (tour == null) return;

        tour.ComputedPopularityScore = logs.Count();

        if (logs.Any())
        {
            double avgDifficulty = logs.Average(l => l.Difficulty); 
            double avgTime = logs.Average(l => l.TotalTime);        
            double avgDistance = logs.Average(l => (double)l.TotalDistance); 

            double diffScore = Math.Max(0, 100 - (avgDifficulty * 20)); 
            double timeScore = Math.Max(0, 100 - (avgTime / 60.0)); 
            double distanceScore = Math.Max(0, 100 - (avgDistance)); 
            
            tour.ComputedChildFriendlyScore = (decimal)((diffScore + timeScore + distanceScore) / 3.0);
        }
        else
        {
            tour.ComputedChildFriendlyScore = 0;
        }

        await _tourRepository.UpdateTourAsync(tour);
        _logger.LogInformation("Recalculated metrics for TourId: {TourId}. Popularity: {Pop}, Child-Friendly: {Child}", 
            tourId, tour.ComputedPopularityScore, tour.ComputedChildFriendlyScore);
    }
}