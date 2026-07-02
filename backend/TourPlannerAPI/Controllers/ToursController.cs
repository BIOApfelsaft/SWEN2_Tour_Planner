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
    public class TourController(ITourService tourService) : ControllerBase
    {
        private readonly ITourService _tourService = tourService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tour>>> GetAllTours()
        {
            var tours = await _tourService.GetAllToursAsync();
            return Ok(tours);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tour>> GetTourById(int id)
        {
            var tour = await _tourService.GetTourByIdAsync(id);
            if (tour == null) return NotFound();
            return Ok(tour);
        }

        [HttpPost]
        public async Task<ActionResult<TourResponse>> CreateTour([FromBody] CreateTourRequest dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

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

            return CreatedAtAction(nameof(GetAllTours), new { id = createdTour.Id }, MapToResponse(createdTour));
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

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
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
                return BadRequest(new { ex.Message });
            }
        }
    }
}