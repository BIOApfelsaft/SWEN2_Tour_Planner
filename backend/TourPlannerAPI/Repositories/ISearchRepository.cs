using TourPlannerAPI.Models.Search;

namespace TourPlannerAPI.Repositories
{
    public interface ISearchRepository
    {
        Task<SearchResultModel> SearchAsync(string term, string type, int userId);
    }
}