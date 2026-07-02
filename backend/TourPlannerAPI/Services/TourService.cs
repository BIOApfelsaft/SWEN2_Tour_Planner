using TourPlannerAPI.Models;
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

    public async Task<Tour> CreateTourAsync(Tour tour, double startLng, double startLat, double endLng, double endLat)
    {
        _logger.LogInformation("Creating new tour and fetching ORS route.");
        
        if (startLng == 0 && startLat == 0)
        {
            var (Lng, Lat) = await _orsClient.GetCoordinatesAsync(tour.StartLocation);
            startLng = Lng;
            startLat = Lat;
        }

        if (endLng == 0 && endLat == 0)
        {
            var (Lng, Lat) = await _orsClient.GetCoordinatesAsync(tour.EndLocation);
            endLng = Lng;
            endLat = Lat;
        }

        var (distance, time, geoJson) = await _orsClient.GetRouteDataAsync(startLng, startLat, endLng, endLat, tour.TransportType);

        tour.Distance = distance;   
        tour.EstimatedTime = time;  
        tour.RouteGeojson = geoJson;
        tour.ComputedPopularityScore = 0;
        tour.ComputedChildFriendlyScore = 0;
        tour.CreatedAt = DateTime.Now;
        tour.UpdatedAt = DateTime.Now;

        return await _tourRepository.CreateTourAsync(tour);
    }

    public async Task<Tour?> UpdateTourAsync(int id, Tour updatedData, double startLng, double startLat, double endLng, double endLat)
    {
        var existingTour = await _tourRepository.GetTourByIdAsync(id);
        if (existingTour == null) return null;

        bool routeChanged = existingTour.StartLocation != updatedData.StartLocation ||
                            existingTour.EndLocation != updatedData.EndLocation ||
                            existingTour.TransportType != updatedData.TransportType;

        if (routeChanged)
        {
            _logger.LogInformation("Route details changed. Recalculating ORS route...");
            
            if (startLng == 0 && startLat == 0)
            {
                var (Lng, Lat) = await _orsClient.GetCoordinatesAsync(updatedData.StartLocation);
                startLng = Lng;
                startLat = Lat;
            }
            if (endLng == 0 && endLat == 0)
            {
                var (Lng, Lat) = await _orsClient.GetCoordinatesAsync(updatedData.EndLocation);
                endLng = Lng;
                endLat = Lat;
            }

            var (distance, time, geoJson) = await _orsClient.GetRouteDataAsync(startLng, startLat, endLng, endLat, updatedData.TransportType);

            existingTour.Distance = distance;
            existingTour.EstimatedTime = time;
            existingTour.RouteGeojson = geoJson;
        }

        existingTour.Title = updatedData.Title;
        existingTour.Description = updatedData.Description;
        existingTour.StartLocation = updatedData.StartLocation;
        existingTour.EndLocation = updatedData.EndLocation;
        existingTour.TransportType = updatedData.TransportType;
        
        existingTour.UpdatedAt = DateTime.Now; 

        await _tourRepository.UpdateTourAsync(existingTour);
        return existingTour;
    }

    public async Task DeleteTourAsync(int id)
    {
        _logger.LogInformation("Deleting tour by ID: {Id}", id);
        await _tourRepository.DeleteTourAsync(id);
    }

    public async Task<(decimal Distance, int EstimatedTime, string GeoJson)> CalculateRoutePreviewAsync(string startLocation, string endLocation, string transportType)
    {
        _logger.LogInformation("Calculating route preview for {Start} to {End}", startLocation, endLocation);

        var (Lng, Lat) = await _orsClient.GetCoordinatesAsync(startLocation);
        var (EndLng, EndLat) = await _orsClient.GetCoordinatesAsync(endLocation);

        var routeData = await _orsClient.GetRouteDataAsync(
            Lng, Lat, 
            EndLng, EndLat, 
            transportType);

        return routeData;
    }
}