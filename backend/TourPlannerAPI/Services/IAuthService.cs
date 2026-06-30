using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(User user, string rawPassword);
        Task<string?> LoginAsync(string username, string password);
    }
}