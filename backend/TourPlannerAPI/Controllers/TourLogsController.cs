using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class TourLogsController : ControllerBase
{
    private readonly ITourLogService _tourLogService;

    public TourLogsController(ITourLogService tourLogService)
    {
        _tourLogService = tourLogService;
    }

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
    public async Task<ActionResult> AddTourLog(TourLog tourLog)
    {
        await _tourLogService.AddTourLogAsync(tourLog);
        return CreatedAtAction(nameof(GetTourLogById), new { id = tourLog.Id }, tourLog);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTourLog(int id, TourLog tourLog)
    {
        if (id != tourLog.Id) return BadRequest();
        await _tourLogService.UpdateTourLogAsync(tourLog);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTourLog(int id)
    {
        await _tourLogService.DeleteTourLogAsync(id);
        return NoContent();
    }
}