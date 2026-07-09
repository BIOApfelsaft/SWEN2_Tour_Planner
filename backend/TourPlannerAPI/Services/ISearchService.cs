using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services
{
    public interface ISearchService
    {
        Task<SearchResultModel> PerformSearchAsync(string term, string type, int userId);
    }
}