using System.Collections.Generic;
using System.Threading.Tasks;
using TourPlannerAPI.Models;
using TourPlannerAPI.DTOs;

namespace TourPlannerAPI.Services;

public interface ITourLogService
{
    Task<IEnumerable<TourLog>> GetTourLogsAsync(int tourId);
    Task<TourLog?> GetTourLogByIdAsync(int id);
    Task<TourLog> AddTourLogAsync(CreateTourLogDto dto);
    Task<bool> UpdateTourLogAsync(int id, CreateTourLogDto dto);
    Task DeleteTourLogAsync(int id);
}