using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.DTOs.Search;
using TourPlannerAPI.Models;
using TourPlannerAPI.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace TourPlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SearchController(ISearchService searchService) : ControllerBase
    {
        private readonly ISearchService _searchService = searchService;

        private int GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userIdString, out int userId) ? userId : 0;
        }

        [HttpGet]
        public async Task<ActionResult<SearchResult>> Search([FromQuery] string term, [FromQuery] string type = "global")
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            try
            {
                SearchResultModel model = await _searchService.PerformSearchAsync(term, type, userId);

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