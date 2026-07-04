using TourPlannerAPI.Models;

namespace TourPlannerAPI.Repositories
{
    public interface IStatsRepository
    {
        Task<UserStatsAggregate> GetUserStatsAsync(int userId);
    }
}