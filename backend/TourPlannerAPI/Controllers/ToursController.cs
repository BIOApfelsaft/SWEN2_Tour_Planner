using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TourController : ControllerBase
{
    private readonly ITourService _tourService;

    public TourController(ITourService tourService)
    {
        _tourService = tourService;
    }

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
    public async Task<ActionResult<Tour>> CreateTour(CreateTourDto dto)
    {
        var createdTour = await _tourService.CreateTourAsync(dto);
        
        return CreatedAtAction(nameof(GetTourById), new { id = createdTour.Id }, createdTour);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTour(int id, Tour tour)
    {
        if (id != tour.Id) return BadRequest();
        await _tourService.UpdateTourAsync(tour);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTour(int id)
    {
        await _tourService.DeleteTourAsync(id);
        return NoContent();
    }
}