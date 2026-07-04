using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;

namespace TourPlannerAPI.Services
{
    public class ImportExportService(IImportExportRepository repository, ITourLogService tourLogService) : IImportExportService
    {
        private readonly IImportExportRepository _repository = repository;
        private readonly ITourLogService _tourLogService = tourLogService;

        public async Task<List<Tour>> GetToursForExportAsync(List<int> tourIds)
        {
            if (tourIds == null || tourIds.Count == 0) return [];
            return await _repository.GetToursWithLogsAsync(tourIds);
        }

        public async Task ImportToursAsync(List<Tour> tours)
        {
            if (tours == null || tours.Count == 0) return;

            await _repository.AddToursAsync(tours);

            foreach (var tour in tours)
            {
                await _tourLogService.CalculateTourScoresAsync(tour.Id);
            }
        }
    }
}