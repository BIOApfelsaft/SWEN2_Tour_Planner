using Microsoft.AspNetCore.Mvc;
using TourPlannerAPI.DTOs.Users;
using TourPlannerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TourPlannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]/me")]
    [Authorize]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet]
        public async Task<ActionResult<UserResponse>> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _userService.GetUserByIdAsync(userId);
            
            if (user == null) return NotFound();

            return Ok(new UserResponse 
            { 
                Id = user.Id, 
                Username = user.Username, 
                Email = user.Email 
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UserUpdateRequest dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _userService.GetUserByIdAsync(userId);
            
            if (user == null) return NotFound();

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.PasswordHash = dto.PasswordHash;

            await _userService.UpdateUserAsync(user);
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMyProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _userService.GetUserByIdAsync(userId);
            
            if (user == null) return NotFound();

            await _userService.DeleteUserAsync(userId);
            return NoContent();
        }
    }
}