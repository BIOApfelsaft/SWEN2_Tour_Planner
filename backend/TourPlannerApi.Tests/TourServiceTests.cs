using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Tests.Services;

[TestFixture]
public class TourServiceTests
{
    private Mock<ITourRepository> _mockTourRepo;
    private Mock<IOpenRouteService> _mockOrsClient;
    private Mock<ITourLogService> _mockTourLogService;
    private Mock<ILogger<TourService>> _mockLogger;
    private TourService _tourService;

    [SetUp]
    public void Setup()
    {
        _mockTourRepo = new Mock<ITourRepository>();
        _mockOrsClient = new Mock<IOpenRouteService>();
        _mockTourLogService = new Mock<ITourLogService>();
        _mockLogger = new Mock<ILogger<TourService>>();

        _tourService = new TourService(
            _mockLogger.Object,
            _mockTourRepo.Object,
            _mockOrsClient.Object,
            _mockTourLogService.Object
        );
    }

    [Test]
    public async Task CreateTourAsync_WithZeroCoordinates_FetchesCoordinatesFromOrs()
    {
        // Arrange
        var newTour = new Tour { StartLocation = "Vienna", EndLocation = "Graz", TransportType = "car" };
        
        _mockOrsClient.Setup(o => o.GetCoordinatesAsync("Vienna")).ReturnsAsync((16.37, 48.20));
        _mockOrsClient.Setup(o => o.GetCoordinatesAsync("Graz")).ReturnsAsync((15.43, 47.07));
        _mockOrsClient.Setup(o => o.GetRouteDataAsync(16.37, 48.20, 15.43, 47.07, "car"))
                      .ReturnsAsync((200m, 7200, "{}"));
                      
        _mockTourRepo.Setup(r => r.CreateTourAsync(It.IsAny<Tour>())).ReturnsAsync(new Tour { Id = 1 });

        // Act
        // Pass 0s to trigger the geocoding logic
        var result = await _tourService.CreateTourAsync(newTour, 0, 0, 0, 0);

        // Assert
        _mockOrsClient.Verify(o => o.GetCoordinatesAsync(It.IsAny<string>()), Times.Exactly(2), "Should fetch coordinates for both start and end locations.");
        _mockOrsClient.Verify(o => o.GetRouteDataAsync(It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<string>()), Times.Once);
        Assert.That(newTour.Distance, Is.EqualTo(200m));
        Assert.That(newTour.EstimatedTime, Is.EqualTo(7200));
    }

    [Test]
    public async Task CreateTourAsync_WithProvidedCoordinates_SkipsGeocoding()
    {
        // Arrange
        var newTour = new Tour { StartLocation = "Vienna", EndLocation = "Graz", TransportType = "car" };
        
        _mockOrsClient.Setup(o => o.GetRouteDataAsync(10, 20, 30, 40, "car"))
                      .ReturnsAsync((100m, 3600, "{}"));
                      
        _mockTourRepo.Setup(r => r.CreateTourAsync(It.IsAny<Tour>())).ReturnsAsync(new Tour { Id = 2 });

        // Act
        // Pass actual coordinates
        await _tourService.CreateTourAsync(newTour, 10, 20, 30, 40);

        // Assert
        _mockOrsClient.Verify(o => o.GetCoordinatesAsync(It.IsAny<string>()), Times.Never, "Should skip geocoding if coordinates are already provided.");
        _mockOrsClient.Verify(o => o.GetRouteDataAsync(10, 20, 30, 40, "car"), Times.Once);
    }

    [Test]
    public async Task UpdateTourAsync_RouteNotChanged_SkipsOrsCall()
    {
        // Arrange
        int tourId = 1;
        var existingTour = new Tour 
        { 
            Id = tourId, 
            StartLocation = "Vienna", 
            EndLocation = "Graz", 
            TransportType = "car",
            Distance = 200m
        };
        var updateData = new Tour 
        { 
            Title = "New Title", // Only the title is changing
            StartLocation = "Vienna", 
            EndLocation = "Graz", 
            TransportType = "car" 
        };

        _mockTourRepo.Setup(r => r.GetTourByIdAsync(tourId)).ReturnsAsync(existingTour);

        // Act
        var result = await _tourService.UpdateTourAsync(tourId, updateData, 0, 0, 0, 0);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Title, Is.EqualTo("New Title"));
        Assert.That(result.Distance, Is.EqualTo(200m), "Distance should remain unchanged.");
        
        _mockOrsClient.Verify(o => o.GetRouteDataAsync(It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<string>()), Times.Never, "Should NOT call ORS if the route hasn't changed.");
        _mockTourRepo.Verify(r => r.UpdateTourAsync(existingTour), Times.Once);
    }

    [Test]
    public async Task UpdateTourAsync_RouteChanged_CallsOrsToRecalculate()
    {
        // Arrange
        int tourId = 1;
        var existingTour = new Tour 
        { 
            Id = tourId, 
            StartLocation = "Vienna", 
            EndLocation = "Graz", 
            TransportType = "car",
            Distance = 200m
        };
        var updateData = new Tour 
        { 
            StartLocation = "Vienna", 
            EndLocation = "Salzburg", // Destination changed!
            TransportType = "car" 
        };

        _mockTourRepo.Setup(r => r.GetTourByIdAsync(tourId)).ReturnsAsync(existingTour);
        _mockOrsClient.Setup(o => o.GetCoordinatesAsync(It.IsAny<string>())).ReturnsAsync((1.0, 1.0));
        _mockOrsClient.Setup(o => o.GetRouteDataAsync(It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<string>()))
                      .ReturnsAsync((300m, 10000, "new_geojson"));

        // Act
        var result = await _tourService.UpdateTourAsync(tourId, updateData, 0, 0, 0, 0);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Distance, Is.EqualTo(300m), "Distance should be updated from ORS.");
        
        _mockOrsClient.Verify(o => o.GetRouteDataAsync(It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<double>(), It.IsAny<string>()), Times.Once, "Should call ORS because the destination changed.");
    }
}