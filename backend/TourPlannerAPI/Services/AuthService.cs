using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TourPlannerAPI.Data;
using TourPlannerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace TourPlannerAPI.Services
{
    public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
    {
        private readonly AppDbContext _db = db;
        private readonly IConfiguration _config = config;

        public async Task<bool> RegisterAsync(User user, string rawPassword)
        {
            if (await _db.Users.AnyAsync(u => u.Username == user.Username))
                return false;
    
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(rawPassword);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<string?> LoginAsync(string username, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return null;

            return GenerateToken(user);
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