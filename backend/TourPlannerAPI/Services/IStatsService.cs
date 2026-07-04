using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services
{
    public interface IStatsService
    {
        Task<List<StatItemModel>> GetFunFactsAsync(int userId);
    }
}