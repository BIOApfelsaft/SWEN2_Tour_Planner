using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TourPlannerAPI.Models;
// Make sure to include your DTO namespace if needed, e.g., using TourPlannerAPI.DTOs;

namespace TourPlannerAPI.Services;

public class TourService : ITourService
{
    private readonly ILogger<TourService> _logger;
    private readonly ITourRepository _tourRepository;
    private readonly OpenRouteServiceClient _orsClient;

    // Inject the OpenRouteServiceClient here to fix "_orsClient does not exist"
    public TourService(
        ILogger<TourService> logger, 
        ITourRepository tourRepository,
        OpenRouteServiceClient orsClient)
    {
        _logger = logger;
        _tourRepository = tourRepository;
        _orsClient = orsClient;
    }

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

    // Accepts CreateTourDto so we can extract StartLng, StartLat, etc.
    public async Task<Tour> CreateTourAsync(CreateTourDto dto)
    {
        _logger.LogInformation("Creating new tour and fetching ORS route.");

        // Storing in a single variable fixes the "var time is not nullable aware" tuple error
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
            Distance = routeData.distance,   // Accessing from the explicit variable
            EstimatedTime = routeData.time,  // Accessing from the explicit variable
            MapImagePath = dto.MapImagePath,
            RouteGeojson = routeData.geoJson,// Accessing from the explicit variable
            ComputedPopularityScore = 0,
            ComputedChildFriendlyScore = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
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