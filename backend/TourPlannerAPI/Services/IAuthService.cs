using System.Threading.Tasks;
using TourPlannerAPI.DTOs;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterDto dto);
    Task<string?> LoginAsync(LoginDto dto);
}