using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;

namespace TourPlannerAPI.Services
{
    public class SearchService(ILogger<SearchService> logger, ISearchRepository searchRepository) : ISearchService
    {
        private readonly ILogger<SearchService> _logger = logger;
        private readonly ISearchRepository _searchRepository = searchRepository;

        public async Task<SearchResultModel> PerformSearchAsync(string term, string type, int userId)
        {
            if (string.IsNullOrWhiteSpace(term) || term.Length < 2)
            {
                _logger.LogDebug("Search skipped. Term was null, empty, or too short. Term: '{Term}'", term);
                return new SearchResultModel();
            }

            _logger.LogInformation("Performing search for term: '{Term}', type: '{Type}', userId: {UserId}", term, type, userId);
            
            type = type.ToLower().Trim();
            
            return await _searchRepository.SearchAsync(term, type, userId);
        }
    }
}