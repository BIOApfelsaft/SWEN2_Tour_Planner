using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services;

public class TourService : ITourService
{
    private readonly ILogger<TourService> _logger;
    private readonly ITourRepository _tourRepository;

    public TourService(ILogger<TourService> logger, ITourRepository tourRepository)
    {
        _logger = logger;
        _tourRepository = tourRepository;
    }

    public async Task<IEnumerable<Tour>> GetAllToursAsync()
    {
        _logger.LogInformation("Fetching all tours.");
        return await _tourRepository.GetAllToursAsync();
    }

    public async Task<Tour> GetTourByIdAsync(int id)
    {
        _logger.LogInformation("Fetching tour by ID: {Id}", id);
        return await _tourRepository.GetTourByIdAsync(id);
    }

    public async Task<Tour> CreateTourAsync(Tour tour)
    {
        _logger.LogInformation("Creating new tour.");
        return await _tourRepository.CreateTourAsync(tour);
    }

    public async Task UpdateTourAsync(Tour tour)
    {
        _logger.LogInformation("Updating tour.");
        await _tourRepository.UpdateTourAsync(tour);
    }

    public async Task DeleteTourAsync(int id)
    {
        _logger.LogInformation("Deleting tour by ID: {Id}", id);
        await _tourRepository.DeleteTourAsync(id);
    }
}