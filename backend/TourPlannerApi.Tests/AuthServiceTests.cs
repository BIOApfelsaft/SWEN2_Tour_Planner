using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using Microsoft.Extensions.Logging;
using TourPlannerAPI.Data;
using TourPlannerAPI.Models;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Tests.Services;

[TestFixture]
public class AuthServiceTests
{
    private AppDbContext _dbContext;
    private IMemoryCache _cache;
    private Mock<IConfiguration> _mockConfig;
    private Mock<ILogger<AuthService>> _mockLogger;
    private AuthService _authService;

    [SetUp]
    public void Setup()
    {
        // 1. Setup In-Memory Database
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        _dbContext = new AppDbContext(options);

        // 2. Setup a real memory cache
        _cache = new MemoryCache(new MemoryCacheOptions());

        // 3. Mock IConfiguration
        _mockConfig = new Mock<IConfiguration>();
        _mockConfig.Setup(c => c["Jwt:Key"]).Returns("SuperSecretKeyThatIsAtLeast32CharactersLong!!!");
        _mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
        _mockConfig.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
        _mockConfig.Setup(c => c["Jwt:ExpiryMinutes"]).Returns("60");

        // 4. Mock Logger
        _mockLogger = new Mock<ILogger<AuthService>>();

        // 5. Instantiate the service
        _authService = new AuthService(_mockLogger.Object, _dbContext, _mockConfig.Object, _cache);
    }

    [TearDown]
    public void TearDown()
    {
        // Clean up the database after each test
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
        _cache.Dispose();
    }

    [Test]
    public async Task RegisterAsync_UsernameOrEmailExists_ReturnsFalse()
    {
        // Arrange: Seed the database with an existing user
        _dbContext.Users.Add(new User 
        { 
            Username = "existinguser", 
            Email = "existing@example.com", 
            PasswordHash = "hash" 
        });
        await _dbContext.SaveChangesAsync();

        var newUserWithSameUsername = new User { Username = "existinguser", Email = "new@example.com" };
        var newUserWithSameEmail = new User { Username = "newuser", Email = "existing@example.com" };

        // Act
        bool resultUsernameMatch = await _authService.RegisterAsync(newUserWithSameUsername, "password123");
        bool resultEmailMatch = await _authService.RegisterAsync(newUserWithSameEmail, "password123");

        // Assert
        Assert.That(resultUsernameMatch, Is.False, "Should fail when username already exists.");
        Assert.That(resultEmailMatch, Is.False, "Should fail when email already exists.");
    }

    [Test]
    public async Task RegisterAsync_ValidUser_HashesPasswordAndReturnsTrue()
    {
        // Arrange
        var newUser = new User { Username = "newuser", Email = "new@example.com" };
        string rawPassword = "mysecurepassword";
        string expectedHash = AuthService.ComputeSha256(rawPassword);

        // Act
        bool result = await _authService.RegisterAsync(newUser, rawPassword);

        // Assert
        Assert.That(result, Is.True, "Registration should succeed for a unique user.");
        
        // Verify the user was actually saved to the in-memory database
        var savedUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == "newuser");
        Assert.That(savedUser, Is.Not.Null, "User should be saved to the database.");
        Assert.That(savedUser.PasswordHash, Is.EqualTo(expectedHash), "Password should be saved as a SHA256 hash.");
    }

    [Test]
    public void GenerateChallenge_ReturnsChallengeAndSavesToCache()
    {
        // Arrange
        string username = "testuser";

        // Act
        string challenge = _authService.GenerateChallenge(username);

        // Assert
        Assert.That(string.IsNullOrEmpty(challenge), Is.False, "Challenge should not be empty.");
        Assert.That(_cache.TryGetValue(username, out string? cachedChallenge), Is.True, "Challenge should be saved in cache.");
        Assert.That(cachedChallenge, Is.EqualTo(challenge), "Cached challenge should match the returned challenge.");
    }

    [Test]
    public async Task LoginWithChallengeAsync_NoChallengeInCache_ReturnsNull()
    {
        // Arrange
        string username = "testuser";
        string clientResponse = "somehash";
        // Do NOT generate a challenge, so the cache remains empty for this user

        // Act
        var result = await _authService.LoginWithChallengeAsync(username, clientResponse);

        // Assert
        Assert.That(result, Is.Null, "Should return null if there is no active challenge in the cache.");
    }

    [Test]
    public async Task LoginWithChallengeAsync_InvalidResponse_ReturnsNull()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "hashedpassword" };
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        string challenge = _authService.GenerateChallenge(user.Username);
        string invalidClientResponse = "wronghash";

        // Act
        var result = await _authService.LoginWithChallengeAsync(user.Username, invalidClientResponse);

        // Assert
        Assert.That(result, Is.Null, "Should return null if the client response does not match the expected hash.");
        Assert.That(_cache.TryGetValue(user.Username, out _), Is.False, "Cache should be cleared even on failed login attempts.");
    }

    [Test]
    public async Task LoginWithChallengeAsync_ValidResponse_ReturnsJwtTokenAndRemovesChallenge()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "hashedpassword" };
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        string challenge = _authService.GenerateChallenge(user.Username);
        
        // Simulate the exact hashing process the frontend should perform
        string expectedResponse = AuthService.ComputeSha256(user.PasswordHash + challenge);

        // Act
        var result = await _authService.LoginWithChallengeAsync(user.Username, expectedResponse);

        // Assert
        Assert.That(result, Is.Not.Null, "Should return a JWT token for valid credentials.");
        Assert.That(result, Does.StartWith("eyJ"), "Token should be a valid JWT format (starts with eyJ).");
        Assert.That(_cache.TryGetValue(user.Username, out _), Is.False, "Cache should be cleared after a successful login.");
    }
}