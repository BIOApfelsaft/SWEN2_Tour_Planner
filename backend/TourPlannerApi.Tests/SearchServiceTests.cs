using Moq;
using NUnit.Framework;
using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;
using Microsoft.Extensions.Logging;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Tests.Services;

[TestFixture]
public class SearchServiceTests
{
    private Mock<ISearchRepository> _mockRepository;
    private Mock<ILogger<SearchService>> _mockLogger;
    private SearchService _searchService;

    [SetUp]
    public void Setup()
    {
        _mockRepository = new Mock<ISearchRepository>();
        _mockLogger = new Mock<ILogger<SearchService>>();
        
        _searchService = new SearchService(_mockLogger.Object, _mockRepository.Object);
    }

    [TestCase(null)]
    [TestCase("")]
    [TestCase(" ")]
    [TestCase("a")]
    public async Task PerformSearchAsync_InvalidTerm_ReturnsEmptyResultAndDoesNotCallRepo(string? invalidTerm)
    {
        // Arrange
        string type = "global";
        int userId = 1;

        // Act
        var result = await _searchService.PerformSearchAsync(invalidTerm!, type, userId);

        // Assert
        Assert.That(result, Is.Not.Null, "Should return an empty model, not null.");
        Assert.That(result.Tours, Is.Empty, "Tours list should be empty.");
        Assert.That(result.Logs, Is.Empty, "Logs list should be empty.");
        
        // Verify the repository was NEVER called
        _mockRepository.Verify(repo => repo.SearchAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()), Times.Never);
    }

    [Test]
    public async Task PerformSearchAsync_ValidTerm_FormatsTypeAndCallsRepo()
    {
        // Arrange
        string term = "validTerm";
        string rawType = "  ToUr  "; // Messy input with spaces and mixed casing
        string expectedType = "tour"; // What we expect the service to pass to the repo
        int userId = 1;

        // Create a fake result for the mock repository to return
        var fakeResult = new SearchResultModel 
        { 
            Tours = [new TourSearchModel { Id = 1, Title = "Fake Tour" }] 
        };

        _mockRepository
            .Setup(repo => repo.SearchAsync(term, expectedType, userId))
            .ReturnsAsync(fakeResult);

        // Act
        var result = await _searchService.PerformSearchAsync(term, rawType, userId);

        // Assert
        Assert.That(result, Is.EqualTo(fakeResult), "Should return the result from the repository.");
        
        // Verify the repository was called exactly once, and that 'rawType' was successfully formatted
        _mockRepository.Verify(repo => repo.SearchAsync(term, expectedType, userId), Times.Once);
    }
}