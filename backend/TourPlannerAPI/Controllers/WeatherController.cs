using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.Services;
using TourPlannerAPI.DTOs.Weather;

namespace TourPlannerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WeatherController(IWeatherService weatherService) : ControllerBase
{
    private readonly IWeatherService _weatherService = weatherService;

    [HttpGet("{location}")]
    public async Task<ActionResult<WeatherResponse>> GetWeatherByLocation(string location)
    {
        try
        {
            var weather = await _weatherService.GetWeatherAsync(location);
            return Ok(weather);
        }
        catch (Exception ex)
        {
            return BadRequest(new { ex.Message });
        }
    }
}