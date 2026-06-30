using TourPlannerAPI.DTOs.Auth;

namespace TourPlannerAPI.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequest dto);
        Task<string?> LoginAsync(LoginRequest dto);
    }
}