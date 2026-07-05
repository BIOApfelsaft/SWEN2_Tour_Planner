using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using NUnit.Framework;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using TourPlannerAPI.Services;

namespace TourPlannerAPI.Tests.Services;

[TestFixture]
public class OpenRouteServiceClientTests
{
    private Mock<IConfiguration> _mockConfig;
    private Mock<ILogger<OpenRouteServiceClient>> _mockLogger;

    [SetUp]
    public void Setup()
    {
        _mockConfig = new Mock<IConfiguration>();
        _mockConfig.Setup(c => c["OpenRouteService:ApiKey"]).Returns("fake-api-key");
        _mockConfig.Setup(c => c["OpenRouteService:BaseUrl"]).Returns("https://api.openrouteservice.org");
        _mockLogger = new Mock<ILogger<OpenRouteServiceClient>>();
        _mockConfig.Setup(c => c[It.IsAny<string>()]).Returns("fake-api-key");
    }

    [Test]
    public async Task GetRouteDataAsync_ValidCoordinates_ConvertsMetersToKilometersAndRounds()
    {
        // Arrange
        // ORS returns distance in meters (e.g., 12345.678 meters -> 12.35 kilometers)
        string fakeJsonResponse = @"{
            ""features"": [{
                ""properties"": {
                    ""summary"": {
                        ""distance"": 12345.678,
                        ""duration"": 3600
                    }
                },
                ""geometry"": { ""type"": ""LineString"", ""coordinates"": [] }
            }]
        }";

        var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
        handlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(fakeJsonResponse)
            })
            .Verifiable();

        var httpClient = new HttpClient(handlerMock.Object);
        var clientService = new OpenRouteServiceClient(httpClient, _mockConfig.Object);

        // Act
        var (distanceKm, timeSeconds, geoJson) = await clientService.GetRouteDataAsync(10, 20, 30, 40, "car");

        // Assert
        Assert.That(distanceKm, Is.EqualTo(12.35m), "Distance should be converted to kilometers and rounded to 2 decimal places.");
        Assert.That(timeSeconds, Is.EqualTo(3600), "Time should remain in seconds.");
        Assert.That(string.IsNullOrEmpty(geoJson), Is.False, "GeoJSON should not be empty.");
    }
}