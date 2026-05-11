using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.DTOs;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        _logger.LogInformation("Registering new user with username: {Username}", dto.Username);
        var result = await _authService.RegisterAsync(dto);
        if (!result) return BadRequest("Username already exists.");
        return Ok("Registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        _logger.LogInformation("User login attempt with username: {Username}", dto.Username);
        var token = await _authService.LoginAsync(dto);
        if (token == null) return Unauthorized("Invalid credentials.");
        return Ok(new { Token = token });
    }
}   