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
        await CalculateTourScoresAsync(log.TourId);
        
        return log;
    }

    public async Task<bool> UpdateTourLogAsync(TourLog updatedLog)
    {
        _logger.LogInformation("Updating tour log ID: {Id}", updatedLog.Id);
        
        updatedLog.UpdatedAt = DateTime.Now;

        await _tourLogRepository.UpdateTourLogAsync(updatedLog);
        await CalculateTourScoresAsync(updatedLog.TourId);
        
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
            await CalculateTourScoresAsync(tourId);
        }
    }

    public async Task CalculateTourScoresAsync(int tourId)
    {
        var logs = await _tourLogRepository.GetTourLogsAsync(tourId);
        var tour = await _tourRepository.GetTourByIdAsync(tourId);

        if (tour == null) return;

        // Popularity Score (Max 100)
        double popularityScore = 0;
        var currentDate = DateTime.Now;

        if (logs.Any())
        {
            foreach (var log in logs)
            {
                var ageInDays = (currentDate - log.LogDateTime).TotalDays;
                double ageWeight = Math.Max(0.2, 1.0 - (ageInDays / 365.0));
                popularityScore += 30.0 * ageWeight;
            }
        }
        
        tour.ComputedPopularityScore = (int)Math.Min(100, Math.Round(popularityScore));

        // Child-Friendly Score (Max 100)
        double diffScore, timeScore, distanceScore;

        // Define thresholds for child-friendly scoring
        // Over 20 km or over 4 hours is considered NOT child-friendly
        const double MaxChildDistanceKm = 20.0;
        const double MaxChildTimeSeconds = 14400.0; // 4 hours

        if (logs.Any())
        {
            double avgDifficulty = logs.Average(l => l.Difficulty); 
            double avgTime = logs.Average(l => l.TotalTime);        
            double avgDistance = logs.Average(l => (double)l.TotalDistance); 

            // Difficulty: 1 (Easy) = 100%, 5 (Hard) = 0%. Formula: 100 - ((Diff - 1) * 25)
            diffScore = Math.Max(0, 100 - ((avgDifficulty - 1) * 25.0)); 
            
            // Time & Distance linear scaling (0 to Max = 100 to 0)
            timeScore = Math.Max(0, 100 - (avgTime / MaxChildTimeSeconds * 100.0)); 
            distanceScore = Math.Max(0, 100 - (avgDistance / MaxChildDistanceKm * 100.0)); 
        }
        else
        {
            // If no logs exist, use the tour's base distance and estimated time for scoring
            double baseDistance = (double)(tour.Distance > 0 ? tour.Distance : 0);
            double baseTime = tour.EstimatedTime > 0 ? tour.EstimatedTime : 0;

            diffScore = 75.0;
            timeScore = Math.Max(0, 100 - (baseTime / MaxChildTimeSeconds * 100.0)); 
            distanceScore = Math.Max(0, 100 - (baseDistance / MaxChildDistanceKm * 100.0)); 
        }

        tour.ComputedChildFriendlyScore = (decimal)Math.Round((diffScore + timeScore + distanceScore) / 3.0, 1);

        await _tourRepository.UpdateTourAsync(tour);
        
        _logger.LogInformation(
            "Recalculated metrics for TourId: {TourId}. Popularity: {Pop}/100, Child-Friendly: {Child}/100", 
            tourId, tour.ComputedPopularityScore, tour.ComputedChildFriendlyScore);
    }
}