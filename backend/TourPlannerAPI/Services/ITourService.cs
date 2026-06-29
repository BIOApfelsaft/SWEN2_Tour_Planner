using System.Collections.Generic;
using System.Threading.Tasks;
using TourPlannerAPI.Models;

public interface ITourService
{
    Task<IEnumerable<Tour>> GetAllToursAsync();
    Task<Tour?> GetTourByIdAsync(int id);
    Task<Tour> CreateTourAsync(CreateTourDto dto);
    Task UpdateTourAsync(Tour tour);
    Task DeleteTourAsync(int id);
}