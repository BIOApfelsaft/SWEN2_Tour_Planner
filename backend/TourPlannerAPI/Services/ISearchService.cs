using TourPlannerAPI.Models.Search;

namespace TourPlannerAPI.Services
{
    public interface ISearchService
    {
        Task<SearchResultModel> PerformSearchAsync(string term, string type);
    }
}