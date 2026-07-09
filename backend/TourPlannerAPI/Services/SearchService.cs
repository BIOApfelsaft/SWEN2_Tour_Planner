using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;

namespace TourPlannerAPI.Services
{
    public class SearchService(ISearchRepository searchRepository) : ISearchService
    {
        private readonly ISearchRepository _searchRepository = searchRepository;

        public async Task<SearchResultModel> PerformSearchAsync(string term, string type, int userId)
        {
            if (string.IsNullOrWhiteSpace(term) || term.Length < 2)
            {
                return new SearchResultModel();
            }

            type = type.ToLower().Trim();
            
            return await _searchRepository.SearchAsync(term, type, userId);
        }
    }
}