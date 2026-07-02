using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.Models;
using TourPlannerAPI.DTOs.TourLogs;
using System.Security.Claims;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TourLogsController(ITourLogService tourLogService, ITourService tourService) : ControllerBase
{
    private readonly ITourLogService _tourLogService = tourLogService;
    private readonly ITourService _tourService = tourService;

    [HttpGet("tour/{tourId}")]
    public async Task<ActionResult<IEnumerable<TourLog>>> GetTourLogs(int tourId)
    {
        var tourLogs = await _tourLogService.GetTourLogsAsync(tourId);
        return Ok(tourLogs.Select(MapToResponse));
    }

    [HttpGet("my-logs")]
    public async Task<ActionResult<IEnumerable<TourLogResponse>>> GetMyLogs()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId)) return Unauthorized();


        var userTours = await _tourService.GetAllToursAsync();
        var myTours = userTours.Where(t => t.UserId == userId).Select(t => t.Id).ToList();

        var allMyLogs = new List<TourLogResponse>();
        foreach (var tourId in myTours)
        {
            var logs = await _tourLogService.GetTourLogsAsync(tourId);
            allMyLogs.AddRange(logs.Select(MapToResponse));
        }

        return Ok(allMyLogs.OrderByDescending(l => l.LogDateTime)); // Newest logs first
    }


    [HttpPost]
    public async Task<ActionResult<TourLogResponse>> AddTourLog([FromBody] CreateTourLogRequest dto)
    {
        var newLog = new TourLog
        {
            TourId = dto.TourId,
            LogDateTime = dto.LogDateTime.ToLocalTime(),
            Comment = dto.Comment,
            Difficulty = dto.Difficulty,
            TotalDistance = dto.TotalDistance,
            TotalTime = dto.TotalTime,
            Rating = dto.Rating,
            WeatherCondition = dto.WeatherCondition,
            Temperature = dto.Temperature
        };

        var createdLog = await _tourLogService.AddTourLogAsync(newLog);
        return CreatedAtAction(nameof(GetTourLogs), new { tourId = createdLog.TourId }, MapToResponse(createdLog));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTourLog(int id, [FromBody] CreateTourLogRequest dto)
    {
        var existingLog = await _tourLogService.GetTourLogByIdAsync(id);
        if (existingLog == null) return NotFound();

        existingLog.LogDateTime = dto.LogDateTime.ToLocalTime();
        existingLog.Comment = dto.Comment;
        existingLog.Difficulty = dto.Difficulty;
        existingLog.TotalDistance = dto.TotalDistance;
        existingLog.TotalTime = dto.TotalTime;
        existingLog.Rating = dto.Rating;
        existingLog.WeatherCondition = dto.WeatherCondition;
        existingLog.Temperature = dto.Temperature;

        await _tourLogService.UpdateTourLogAsync(existingLog);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTourLog(int id)
    {
        await _tourLogService.DeleteTourLogAsync(id);
        return NoContent();
    }

    private static TourLogResponse MapToResponse(TourLog log)
    {
        return new TourLogResponse
        {
            Id = log.Id,
            TourId = log.TourId,
            LogDateTime = log.LogDateTime,
            Comment = log.Comment,
            Difficulty = log.Difficulty,
            TotalDistance = log.TotalDistance,
            TotalTime = log.TotalTime,
            Rating = log.Rating,
            WeatherCondition = log.WeatherCondition,
            Temperature = log.Temperature
        };
    }
}