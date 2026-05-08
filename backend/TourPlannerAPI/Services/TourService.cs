using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services;

public class TourService : ITourService
{
    private readonly ITourRepository _tourRepository;

    public TourService(ITourRepository tourRepository)
    {
        _tourRepository = tourRepository;
    }

    public async Task<IEnumerable<Tour>> GetAllToursAsync()
    {
        return await _tourRepository.GetAllToursAsync();
    }

    public async Task<Tour> GetTourByIdAsync(int id)
    {
        return await _tourRepository.GetTourByIdAsync(id);
    }

    public async Task<Tour> CreateTourAsync(Tour tour)
    {
        return await _tourRepository.CreateTourAsync(tour);
    }

    public async Task UpdateTourAsync(Tour tour)
    {
        await _tourRepository.UpdateTourAsync(tour);
    }

    public async Task DeleteTourAsync(int id)
    {
        await _tourRepository.DeleteTourAsync(id);
    }
}