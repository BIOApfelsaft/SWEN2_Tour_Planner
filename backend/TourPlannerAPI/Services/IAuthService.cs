using TourPlannerAPI.Models;

namespace TourPlannerAPI.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(User user, string rawPassword);

        string GenerateChallenge(string username);

        Task<string?> LoginWithChallengeAsync(string username, string clientResponse);
    }
}