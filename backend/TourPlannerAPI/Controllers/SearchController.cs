using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.DTOs.Search;
using TourPlannerAPI.Models.Search;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController(ISearchService searchService) : ControllerBase
    {
        private readonly ISearchService _searchService = searchService;

        [HttpGet]
        public async Task<ActionResult<SearchResult>> Search([FromQuery] string term, [FromQuery] string type = "global")
        {
            try
            {
                SearchResultModel model = await _searchService.PerformSearchAsync(term, type);

                var dto = new SearchResult
                {
                    Tours = [.. model.Tours.Select(t => new TourSearchResult
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Description = t.Description
                    })],
                    
                    Logs = [.. model.Logs.Select(l => new LogSearchResult
                    {
                        Id = l.Id,
                        TourId = l.TourId,
                        Comment = l.Comment,
                        TourTitle = l.TourTitle
                    })]
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
            }
        }
    }
}