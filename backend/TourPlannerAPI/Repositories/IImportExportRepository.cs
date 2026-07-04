using TourPlannerAPI.Models;

namespace TourPlannerAPI.Repositories
{
    public interface IImportExportRepository
    {
        Task<List<Tour>> GetToursWithLogsAsync(List<int> tourIds);
        Task AddToursAsync(List<Tour> tours);
    }
}