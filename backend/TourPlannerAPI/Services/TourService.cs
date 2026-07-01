using TourPlannerAPI.Models;
using TourPlannerAPI.DTOs;
using TourPlannerAPI.Repositories;

namespace TourPlannerAPI.Services;

public class TourService(
    ILogger<TourService> logger,
    ITourRepository tourRepository,
    OpenRouteServiceClient orsClient) : ITourService
{
    private readonly ILogger<TourService> _logger = logger;
    private readonly ITourRepository _tourRepository = tourRepository;
    private readonly OpenRouteServiceClient _orsClient = orsClient;

    public async Task<IEnumerable<Tour>> GetAllToursAsync()
    {
        _logger.LogInformation("Fetching all tours.");
        return await _tourRepository.GetAllToursAsync();
    }

    public async Task<Tour?> GetTourByIdAsync(int id)
    {
        _logger.LogInformation("Fetching tour by ID: {Id}", id);
        return await _tourRepository.GetTourByIdAsync(id);
    }

    public async Task<Tour> CreateTourAsync(CreateTourDto dto)
    {
        _logger.LogInformation("Creating new tour and fetching ORS route.");
        var routeData = await _orsClient.GetRouteDataAsync(
            dto.StartLng, dto.StartLat, dto.EndLng, dto.EndLat, dto.TransportType);

        var tour = new Tour
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Description = dto.Description,
            StartLocation = dto.StartLocation,
            EndLocation = dto.EndLocation,
            TransportType = dto.TransportType,
            Distance = routeData.distance,   
            EstimatedTime = routeData.time,  
            MapImagePath = dto.MapImagePath,
            RouteGeojson = routeData.geoJson,
            ComputedPopularityScore = 0,
            ComputedChildFriendlyScore = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        return await _tourRepository.CreateTourAsync(tour);
    }

    public async Task UpdateTourAsync(Tour tour)
    {
        _logger.LogInformation("Updating tour.");
        tour.UpdatedAt = DateTime.UtcNow;
        await _tourRepository.UpdateTourAsync(tour);
    }

    public async Task DeleteTourAsync(int id)
    {
        _logger.LogInformation("Deleting tour by ID: {Id}", id);
        await _tourRepository.DeleteTourAsync(id);
    }
}