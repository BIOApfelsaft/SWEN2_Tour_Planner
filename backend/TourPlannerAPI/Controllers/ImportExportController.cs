using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TourPlannerAPI.DTOs.ImportExport;
using TourPlannerAPI.Models;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImportExportController(IImportExportService importExportService) : ControllerBase
    {
        private readonly IImportExportService _importExportService = importExportService;

        private int GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userIdString, out int userId) ? userId : 0;
        }

        [HttpPost("export")]
        public async Task<ActionResult<List<TourExport>>> Export([FromBody] List<int> tourIds)
        {
            List<Tour> tours = await _importExportService.GetToursForExportAsync(tourIds);

            var dtos = tours.Select(t => new TourExport
            {
                Title = t.Title,
                Description = t.Description,
                StartLocation = t.StartLocation,
                EndLocation = t.EndLocation,
                TransportType = t.TransportType,
                Distance = t.Distance,
                EstimatedTime = t.EstimatedTime,
                RouteGeojson = t.RouteGeojson,
                Logs = [.. t.TourLogs.Select(l => new TourLogExport
                {
                    LogDateTime = l.LogDateTime,
                    Comment = l.Comment,
                    Difficulty = l.Difficulty,
                    TotalTime = l.TotalTime,
                    TotalDistance = l.TotalDistance,
                    Rating = l.Rating
                })]
            }).ToList();

            return Ok(dtos);
        }

        [HttpPost("import")]
        public async Task<IActionResult> Import([FromBody] List<TourExport> dtos)
        {
            var currentUserId = GetCurrentUserId();
            var newTours = dtos.Select(dto => new Tour
            {
                Title = dto.Title,
                Description = dto.Description,
                StartLocation = dto.StartLocation,
                EndLocation = dto.EndLocation,
                TransportType = dto.TransportType,
                Distance = dto.Distance,
                EstimatedTime = dto.EstimatedTime,
                RouteGeojson = dto.RouteGeojson,
                UserId = currentUserId,
                
                TourLogs = [.. dto.Logs.Select(logDto => new TourLog
                {
                    LogDateTime = logDto.LogDateTime,
                    Comment = logDto.Comment,
                    Difficulty = logDto.Difficulty,
                    TotalTime = logDto.TotalTime,
                    TotalDistance = logDto.TotalDistance,
                    Rating = logDto.Rating
                })]
            }).ToList();

            await _importExportService.ImportToursAsync(newTours);

            return Ok(new { message = "Import successful" });
        }
    }
}