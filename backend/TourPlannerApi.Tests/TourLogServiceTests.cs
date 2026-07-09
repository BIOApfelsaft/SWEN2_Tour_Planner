using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Tests.Services;

[TestFixture]
public class TourLogServiceTests
{
    private Mock<ITourLogRepository> _mockLogRepo;
    private Mock<ITourRepository> _mockTourRepo;
    private Mock<ILogger<TourLogService>> _mockLogger;
    private TourLogService _tourLogService;

    [SetUp]
    public void Setup()
    {
        _mockLogRepo = new Mock<ITourLogRepository>();
        _mockTourRepo = new Mock<ITourRepository>();
        _mockLogger = new Mock<ILogger<TourLogService>>();

        _tourLogService = new TourLogService(
            _mockLogger.Object, 
            _mockLogRepo.Object, 
            _mockTourRepo.Object
        );
    }

    [Test]
    public async Task CalculateTourScoresAsync_NoLogs_UsesBaseTourDataForChildFriendlyScore()
    {
        // Arrange
        int tourId = 1;
        var tour = new Tour 
        { 
            Id = tourId, 
            Distance = 10m, // 10 km (50% of 20km max) = 50 score
            EstimatedTime = 3600 // 1 hour (25% of 4 hour max) = 75 score
        }; 
        // Base diff score is 75. 
        // Expected Average: (75 + 75 + 50) / 3 = 66.7

        _mockLogRepo.Setup(r => r.GetTourLogsAsync(tourId)).ReturnsAsync(new List<TourLog>());
        _mockTourRepo.Setup(r => r.GetTourByIdAsync(tourId)).ReturnsAsync(tour);

        // Act
        await _tourLogService.CalculateTourScoresAsync(tourId);

        // Assert
        Assert.That(tour.ComputedPopularityScore, Is.EqualTo(0m), "Popularity should be 0 with no logs.");
        Assert.That(tour.ComputedChildFriendlyScore, Is.EqualTo(66.7m), "Child-friendly score should use base tour data and round to 1 decimal.");
        
        // Verify the tour repository was called to save the updated scores
        _mockTourRepo.Verify(r => r.UpdateTourAsync(tour), Times.Once);
    }

    [Test]
    public async Task CalculateTourScoresAsync_WithLogs_CalculatesScoresCorrectly()
    {
        // Arrange
        int tourId = 1;
        var tour = new Tour { Id = tourId };
        
        var logs = new List<TourLog>
        {
            new TourLog 
            { 
                LogDateTime = DateTime.Now, // Age = 0 days, Weight = 1.0 -> Pop score = 30
                Difficulty = 2,             // Diff Score = 100 - (1 * 25) = 75
                TotalTime = 7200,           // 2 hours. Time Score = 100 - (50%) = 50
                TotalDistance = 15m         // 15 km. Dist Score = 100 - (75%) = 25
            }
        }; 
        // Expected Child-Friendly Avg: (75 + 50 + 25) / 3 = 50

        _mockLogRepo.Setup(r => r.GetTourLogsAsync(tourId)).ReturnsAsync(logs);
        _mockTourRepo.Setup(r => r.GetTourByIdAsync(tourId)).ReturnsAsync(tour);

        // Act
        await _tourLogService.CalculateTourScoresAsync(tourId);

        // Assert
        Assert.That(tour.ComputedPopularityScore, Is.EqualTo(30m), "Popularity should be 30 for a single brand-new log.");
        Assert.That(tour.ComputedChildFriendlyScore, Is.EqualTo(50.0m), "Child-friendly score should average correctly based on log data.");
    }

    [Test]
    public async Task AddTourLogAsync_SavesLogAndTriggersScoreRecalculation()
    {
        // Arrange
        int tourId = 1;
        var newLog = new TourLog { TourId = tourId };
        var tour = new Tour { Id = tourId };

        // Setup the repos so CalculateTourScoresAsync doesn't crash when called internally
        _mockLogRepo.Setup(r => r.GetTourLogsAsync(tourId)).ReturnsAsync(new List<TourLog> { newLog });
        _mockTourRepo.Setup(r => r.GetTourByIdAsync(tourId)).ReturnsAsync(tour);

        // Act
        var result = await _tourLogService.AddTourLogAsync(newLog);

        // Assert
        Assert.That(result.CreatedAt, Is.Not.EqualTo(default(DateTime)), "CreatedAt should be populated.");
        _mockLogRepo.Verify(r => r.AddTourLogAsync(newLog), Times.Once, "Repository Add method should be called.");
        
        // Verify that adding a log caused the tour to be updated with new scores
        _mockTourRepo.Verify(r => r.UpdateTourAsync(It.IsAny<Tour>()), Times.Once, "Tour scores should be recalculated and updated.");
    }

    [Test]
    public async Task UpdateTourLogAsync_UpdatesLogAndTriggersScoreRecalculation()
    {
        // Arrange
        int tourId = 1;
        var existingLog = new TourLog { Id = 10, TourId = tourId, Difficulty = 3 };
        var tour = new Tour { Id = tourId };

        _mockLogRepo.Setup(r => r.GetTourLogsAsync(tourId)).ReturnsAsync(new List<TourLog> { existingLog });
        _mockTourRepo.Setup(r => r.GetTourByIdAsync(tourId)).ReturnsAsync(tour);

        // Act
        await _tourLogService.UpdateTourLogAsync(existingLog);

        // Assert
        _mockLogRepo.Verify(r => r.UpdateTourLogAsync(existingLog), Times.Once, "Should update the log in the repository.");
        _mockTourRepo.Verify(r => r.UpdateTourAsync(It.IsAny<Tour>()), Times.Once, "Should trigger the score recalculation and update the tour.");
    }

    [Test]
    public async Task DeleteTourLogAsync_DeletesLogAndTriggersScoreRecalculation()
    {
        // Arrange
        int logId = 10;
        int tourId = 1;
        var existingLog = new TourLog { Id = logId, TourId = tourId };
        var tour = new Tour { Id = tourId };

        _mockLogRepo.Setup(r => r.GetTourLogByIdAsync(logId)).ReturnsAsync(existingLog);
        _mockLogRepo.Setup(r => r.GetTourLogsAsync(tourId)).ReturnsAsync(new List<TourLog>()); // Empty list after deletion
        _mockTourRepo.Setup(r => r.GetTourByIdAsync(tourId)).ReturnsAsync(tour);

        // Act
        await _tourLogService.DeleteTourLogAsync(logId);

        // Assert
        _mockLogRepo.Verify(r => r.DeleteTourLogAsync(logId), Times.Once, "Should delete the log from the repository.");
        _mockTourRepo.Verify(r => r.UpdateTourAsync(It.IsAny<Tour>()), Times.Once, "Should trigger the score recalculation and update the tour.");
    }
}