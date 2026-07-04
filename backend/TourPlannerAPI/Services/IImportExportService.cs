using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services
{
    public interface IImportExportService
    {
        Task<List<Tour>> GetToursForExportAsync(List<int> tourIds);
        Task ImportToursAsync(List<Tour> tours);
    }
}