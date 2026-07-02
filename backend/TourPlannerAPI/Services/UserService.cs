using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;

namespace TourPlannerAPI.Services
{
    public class UserService(ILogger<UserService> logger, IUserRepository userRepository) : IUserService
    {
        private readonly ILogger<UserService> _logger = logger;
        private readonly IUserRepository _userRepository = userRepository;

        public Task<IEnumerable<User>> GetAllUsersAsync()
        {
            _logger.LogInformation("Fetching all users.");
            return _userRepository.GetAllUsersAsync();
        }

        public Task<User?> GetUserByIdAsync(int id)
        {
            _logger.LogInformation("Fetching user by ID: {Id}", id);
            return _userRepository.GetUserByIdAsync(id);
        }

        public Task<User> CreateUserAsync(User user)
        {
            _logger.LogInformation("Creating new user.");
            return _userRepository.CreateUserAsync(user);
        }

        public Task UpdateUserAsync(User user)
        {
            _logger.LogInformation("Updating user.");
            return _userRepository.UpdateUserAsync(user);
        }

        public Task DeleteUserAsync(int id)
        {
            _logger.LogInformation("Deleting user by ID: {Id}", id);
            return _userRepository.DeleteUserAsync(id);
        }
    }
}