using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TourPlannerAPI.Models;
using TourPlannerAPI.DTOs.Tours;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TourController(ITourService tourService, ITourLogService tourLogService) : ControllerBase
    {
        private readonly ITourService _tourService = tourService;
        private readonly ITourLogService _tourLogService = tourLogService;

        private int GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userIdString, out int userId) ? userId : 0;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tour>>> GetAllTours()
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var tours = await _tourService.GetAllToursAsync();
            var myTours = tours.Where(t => t.UserId == userId);
            
            return Ok(myTours);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tour>> GetTourById(int id)
        {
            var userId = GetCurrentUserId();
            var tour = await _tourService.GetTourByIdAsync(id);
            
            if (tour == null) return NotFound();

            if (tour.UserId != userId) return Forbid(); 

            return Ok(tour);
        }

        [HttpPost]
        public async Task<ActionResult<TourResponse>> CreateTour([FromBody] CreateTourRequest dto)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var newTour = new Tour
            {
                UserId = userId,
                Title = dto.Title,
                Description = dto.Description,
                StartLocation = dto.StartLocation,
                EndLocation = dto.EndLocation,
                TransportType = dto.TransportType,
                MapImagePath = dto.MapImagePath
            };

            var createdTour = await _tourService.CreateTourAsync(
                newTour, dto.StartLng, dto.StartLat, dto.EndLng, dto.EndLat);

            await _tourLogService.CalculateTourScoresAsync(createdTour.Id);
            
            var result = CreatedAtAction(nameof(GetAllTours), new { id = createdTour.Id }, MapToResponse(createdTour));

            return result;
        }

        private static TourResponse MapToResponse(Tour tour)
        {
            return new TourResponse
            {
                Id = tour.Id,
                Title = tour.Title,
                Description = tour.Description,
                StartLocation = tour.StartLocation,
                EndLocation = tour.EndLocation,
                TransportType = tour.TransportType,
                Distance = tour.Distance,
                EstimatedTime = tour.EstimatedTime,
                MapImagePath = tour.MapImagePath,
                RouteGeojson = tour.RouteGeojson,
                ComputedPopularityScore = tour.ComputedPopularityScore,
                ComputedChildFriendlyScore = tour.ComputedChildFriendlyScore
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTour(int id, [FromBody] CreateTourRequest dto)
        {
            var userId = GetCurrentUserId();

            var existingTour = await _tourService.GetTourByIdAsync(id);
            if (existingTour == null) return NotFound();
            if (existingTour.UserId != userId) return Forbid();

            var tourUpdate = new Tour
            {
                Title = dto.Title,
                Description = dto.Description,
                StartLocation = dto.StartLocation,
                EndLocation = dto.EndLocation,
                TransportType = dto.TransportType
            };

            var updatedTour = await _tourService.UpdateTourAsync(id, tourUpdate, dto.StartLng, dto.StartLat, dto.EndLng, dto.EndLat);
            
            if (updatedTour == null) return NotFound();

            await _tourLogService.CalculateTourScoresAsync(updatedTour.Id);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var userId = GetCurrentUserId();

            var existingTour = await _tourService.GetTourByIdAsync(id);
            if (existingTour == null) return NotFound();
            if (existingTour.UserId != userId) return Forbid();

            Console.WriteLine($"Deleting tour with ID: {id}");
            await _tourService.DeleteTourAsync(id);
            return NoContent();
        }

        [HttpGet("calculate")]
        public async Task<ActionResult<RouteCalculationResponse>> CalculateRoutePreview([FromQuery] string start, [FromQuery] string end, [FromQuery] string transportType)
        {
            try
            {
                var (Distance, EstimatedTime, GeoJson) = await _tourService.CalculateRoutePreviewAsync(start, end, transportType);

                return Ok(new RouteCalculationResponse
                {
                    Distance = Distance,
                    EstimatedTime = EstimatedTime,
                    GeoJson = GeoJson
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}