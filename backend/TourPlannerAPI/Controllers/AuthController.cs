using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.DTOs.Auth;
using TourPlannerAPI.Models;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, ILogger<AuthController> logger) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly ILogger<AuthController> _logger = logger;

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest dto)
        {
            _logger.LogInformation("Registering new user with username: {Username}", dto.Username);

            var newUser = new User
            {
                Username = dto.Username,
                Email = dto.Email
            };

            var result = await _authService.RegisterAsync(newUser, dto.Password);
            
            if (!result) 
            {
                return Conflict(new { message = "Username or email already exists." });
            }

            return Ok(new RegisterResponse { Message = "Registered successfully." });
        }

        [HttpGet("challenge/{username}")]
        public ActionResult<ChallengeResponse> GetChallenge(string username)
        {
            var challenge = _authService.GenerateChallenge(username);
            return Ok(new ChallengeResponse { Challenge = challenge });
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest dto)
        {
            _logger.LogInformation("User login attempt with username: {Username}", dto.Username);
            
            var token = await _authService.LoginWithChallengeAsync(dto.Username, dto.Password);
            
            if (token == null) 
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }
            
            return Ok(new LoginResponse { Token = token });
        }
    }
}