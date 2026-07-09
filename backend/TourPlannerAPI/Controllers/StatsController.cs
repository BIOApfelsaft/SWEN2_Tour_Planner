using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TourPlannerAPI.DTOs.Stats;
using TourPlannerAPI.Services;
using Microsoft.AspNetCore.Authorization;

namespace TourPlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatsController(IStatsService statsService) : ControllerBase
    {
        private readonly IStatsService _statsService = statsService;

        [HttpGet("dashboard")]
        public async Task<ActionResult<List<StatItemResponse>>> GetDashboardStats()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("id");
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int currentUserId))
            {
                return Unauthorized(new { message = "You must be logged in to view stats." });
            }

            var models = await _statsService.GetFunFactsAsync(currentUserId);

            var dtos = models.Select(m => new StatItemResponse
            {
                Icon = m.Icon,
                Label = m.Label,
                Value = m.Value
            }).ToList();

            return Ok(dtos);
        }
    }
}