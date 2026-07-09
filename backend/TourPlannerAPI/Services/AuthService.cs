using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TourPlannerAPI.Data;
using TourPlannerAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Cryptography;

namespace TourPlannerAPI.Services
{
    public class AuthService(ILogger<AuthService> logger, AppDbContext db, IConfiguration config, IMemoryCache cache) : IAuthService
    {
        private readonly ILogger<AuthService> _logger = logger;
        private readonly AppDbContext _db = db;
        private readonly IConfiguration _config = config;
        private readonly IMemoryCache _cache = cache;

        public async Task<bool> RegisterAsync(User user, string rawPassword)
        {
            _logger.LogInformation("Attempting to register user: {Username}", user.Username);

            // Check if either the Username OR the Email already exists in the database
            if (await _db.Users.AnyAsync(u => u.Username == user.Username || u.Email == user.Email))
            {
                _logger.LogWarning("Registration failed. Username '{Username}' or Email '{Email}' already exists.", user.Username, user.Email);
                return false;
            }
    
            user.PasswordHash = ComputeSha256(rawPassword);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            
            _logger.LogInformation("Successfully registered user: {Username}", user.Username);
            return true;
        }

        public string GenerateChallenge(string username)
        {
            _logger.LogInformation("Generating auth challenge for user: {Username}", username);
            var challenge = Guid.NewGuid().ToString("N");
            
            // Save challenge in cache with 2 minutes expiration time
            _cache.Set(username, challenge, TimeSpan.FromMinutes(2));
            
            return challenge;
        }

        public async Task<string?> LoginWithChallengeAsync(string username, string clientResponse)
        {
            _logger.LogInformation("Login attempt for user: {Username}", username);

            if (!_cache.TryGetValue(username, out string? activeChallenge))
            {
                _logger.LogWarning("Login failed. No active challenge found for user: {Username} (Challenge may have expired)", username);
                return null;
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) 
            {
                _logger.LogWarning("Login failed. User not found: {Username}", username);
                return null;
            }

            var expectedResponse = ComputeSha256(user.PasswordHash + activeChallenge);
            _cache.Remove(username);

            if (expectedResponse != clientResponse)
            {
                _logger.LogWarning("Login failed. Invalid challenge response for user: {Username}", username);
                return null;
            }

            _logger.LogInformation("Login successful for user: {Username}", username);
            return GenerateToken(user);
        }

        public static string ComputeSha256(string rawData)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawData));
            var builder = new StringBuilder();
            foreach (var b in bytes) builder.Append(b.ToString("x2"));
            return builder.ToString();
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}