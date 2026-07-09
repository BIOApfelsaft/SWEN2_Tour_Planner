using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Tests.Services;

[TestFixture]
public class ImportExportServiceTests
{
    private Mock<IImportExportRepository> _mockRepo;
    private Mock<ITourLogService> _mockTourLogService;
    private ImportExportService _importExportService;

    [SetUp]
    public void Setup()
    {
        _mockRepo = new Mock<IImportExportRepository>();
        _mockTourLogService = new Mock<ITourLogService>();
        _importExportService = new ImportExportService(_mockRepo.Object, _mockTourLogService.Object);
    }

    [Test]
    public async Task GetToursForExportAsync_NullOrEmptyIds_ReturnsEmptyListAndDoesNotCallRepo()
    {
        // Act
        var resultNull = await _importExportService.GetToursForExportAsync(null!);
        var resultEmpty = await _importExportService.GetToursForExportAsync(new List<int>());

        // Assert
        Assert.That(resultNull, Is.Empty, "Null list should return an empty list.");
        Assert.That(resultEmpty, Is.Empty, "Empty list should return an empty list.");
        
        _mockRepo.Verify(r => r.GetToursWithLogsAsync(It.IsAny<List<int>>()), Times.Never, "Repository should not be called for empty inputs.");
    }

    [Test]
    public async Task GetToursForExportAsync_ValidIds_CallsRepository()
    {
        // Arrange
        var ids = new List<int> { 1, 2 };
        var fakeTours = new List<Tour> { new Tour { Id = 1 }, new Tour { Id = 2 } };
        
        _mockRepo.Setup(r => r.GetToursWithLogsAsync(ids)).ReturnsAsync(fakeTours);

        // Act
        var result = await _importExportService.GetToursForExportAsync(ids);

        // Assert
        Assert.That(result.Count, Is.EqualTo(2));
        _mockRepo.Verify(r => r.GetToursWithLogsAsync(ids), Times.Once);
    }

    [Test]
    public async Task ImportToursAsync_NullOrEmptyTours_DoesNothing()
    {
        // Act
        await _importExportService.ImportToursAsync(null!);
        await _importExportService.ImportToursAsync(new List<Tour>());

        // Assert
        _mockRepo.Verify(r => r.AddToursAsync(It.IsAny<List<Tour>>()), Times.Never, "Repository should not save empty data.");
        _mockTourLogService.Verify(s => s.CalculateTourScoresAsync(It.IsAny<int>()), Times.Never, "Score calculation should not be triggered.");
    }

    [Test]
    public async Task ImportToursAsync_ValidTours_AddsToursAndCalculatesScoresForEach()
    {
        // Arrange
        var tours = new List<Tour>
        {
            new Tour { Id = 10 },
            new Tour { Id = 20 }
        };

        // Act
        await _importExportService.ImportToursAsync(tours);

        // Assert
        _mockRepo.Verify(r => r.AddToursAsync(tours), Times.Once, "Should call repository to save tours.");
        
        // Verify that the score calculation was called specifically for Id 10 and Id 20
        _mockTourLogService.Verify(s => s.CalculateTourScoresAsync(10), Times.Once, "Should calculate scores for Tour 10.");
        _mockTourLogService.Verify(s => s.CalculateTourScoresAsync(20), Times.Once, "Should calculate scores for Tour 20.");
        
        // Verify it was called exactly twice overall
        _mockTourLogService.Verify(s => s.CalculateTourScoresAsync(It.IsAny<int>()), Times.Exactly(2), "Should calculate scores exactly twice.");
    }
}