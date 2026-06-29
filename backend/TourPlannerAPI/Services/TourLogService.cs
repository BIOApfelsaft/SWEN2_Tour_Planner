using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using TourPlannerAPI.Models;

public class TourLogService : ITourLogService
{
    private readonly ILogger<TourLogService> _logger;
    private readonly ITourLogRepository _tourLogRepository;
    private readonly ITourRepository _tourRepository;

    public TourLogService(
        ILogger<TourLogService> logger, 
        ITourLogRepository tourLogRepository, 
        ITourRepository tourRepository)
    {
        _logger = logger;
        _tourLogRepository = tourLogRepository;
        _tourRepository = tourRepository;
    }

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

    public async Task AddTourLogAsync(TourLog tourLog)
    {
        _logger.LogInformation("Adding new tour log for TourId: {TourId}", tourLog.TourId);
        await _tourLogRepository.AddTourLogAsync(tourLog);
        
        // Update computed fields on the parent tour
        await RecalculateTourScoresAsync(tourLog.TourId);
    }

    public async Task UpdateTourLogAsync(TourLog tourLog)
    {
        _logger.LogInformation("Updating tour log ID: {Id}", tourLog.Id);
        await _tourLogRepository.UpdateTourLogAsync(tourLog);
        
        // Update computed fields on the parent tour
        await RecalculateTourScoresAsync(tourLog.TourId);
    }

    public async Task DeleteTourLogAsync(int id)
    {
        _logger.LogInformation("Deleting tour log by ID: {Id}", id);
        
        var tourLog = await _tourLogRepository.GetTourLogByIdAsync(id);
        if (tourLog != null)
        {
            int tourId = tourLog.TourId;
            await _tourLogRepository.DeleteTourLogAsync(id);
            
            // Update computed fields on the parent tour
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

            // Higher score = more child friendly. Custom example formula out of 100 max:
            // High difficulty penalty
            double diffScore = Math.Max(0, 100 - (avgDifficulty * 20)); 
            
            // Long time penalty (loses 1 point per hour/60 mins)
            double timeScore = Math.Max(0, 100 - (avgTime / 60.0)); 
            
            // Long distance penalty (loses 1 pt per km)
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