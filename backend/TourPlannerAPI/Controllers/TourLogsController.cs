using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.Models;
using TourPlannerAPI.DTOs;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TourLogsController(ITourLogService tourLogService) : ControllerBase
{
    private readonly ITourLogService _tourLogService = tourLogService;

    [HttpGet("tour/{tourId}")]
    public async Task<ActionResult<IEnumerable<TourLog>>> GetTourLogs(int tourId)
    {
        var tourLogs = await _tourLogService.GetTourLogsAsync(tourId);
        return Ok(tourLogs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TourLog>> GetTourLogById(int id)
    {
        var tourLog = await _tourLogService.GetTourLogByIdAsync(id);
        if (tourLog == null) return NotFound();
        return Ok(tourLog);
    }

    [HttpPost]
    public async Task<ActionResult<TourLog>> AddTourLog(CreateTourLogDto dto)
    {
        var createdLog = await _tourLogService.AddTourLogAsync(dto);
        
        return CreatedAtAction(nameof(GetTourLogById), new { id = createdLog.Id }, createdLog);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTourLog(int id, CreateTourLogDto dto)
    {
        var updated = await _tourLogService.UpdateTourLogAsync(id, dto);
        
        if (!updated) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTourLog(int id)
    {
        await _tourLogService.DeleteTourLogAsync(id);
        return NoContent();
    }
}