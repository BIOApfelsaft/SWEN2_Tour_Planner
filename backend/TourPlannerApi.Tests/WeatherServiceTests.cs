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
public class WeatherServiceTests
{
    private Mock<IOpenRouteService> _mockOrsClient;

    [SetUp]
    public void Setup()
    {
        _mockOrsClient = new Mock<IOpenRouteService>();
    }

    [Test]
    public async Task GetWeatherAsync_ParsesApiResponseAndMapsWmoCodeCorrectly()
    {
        // Arrange
        string fakeJsonResponse = @"{
            ""current_weather"": {
                ""temperature"": -5.5,
                ""weathercode"": 71
            },
            ""current"": {
                ""temperature_2m"": -5.5,
                ""weather_code"": 71
            }
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
            });

        var httpClient = new HttpClient(handlerMock.Object) 
        { 
            BaseAddress = new System.Uri("https://api.open-meteo.com") 
        };

        // Tell the mock ORS to return coordinates when asked for "Vienna"
        _mockOrsClient.Setup(o => o.GetCoordinatesAsync("Vienna")).ReturnsAsync((16.37, 48.20));

        // Inject the ORS mock into your WeatherService
        var weatherService = new WeatherService(httpClient, _mockOrsClient.Object);

        // Act: Pass a single string argument (the city name)
        var result = await weatherService.GetWeatherAsync("Vienna");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Temperature, Is.EqualTo(-5.5m), "Should parse the exact temperature.");
        Assert.That(result.Condition, Is.EqualTo("Snow"), "WMO code 71 should map to 'Snow'.");
    }

    [Test]
    public async Task GetWeatherAsync_UnknownWmoCode_FallsBackToUnknown()
    {
        // Arrange
        string fakeJsonResponse = @"{
            ""current_weather"": {
                ""temperature"": 20.0,
                ""weathercode"": 999
            },
            ""current"": {
                ""temperature_2m"": 20.0,
                ""weather_code"": 999
            }
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
            });

        var httpClient = new HttpClient(handlerMock.Object) 
        { 
            BaseAddress = new System.Uri("https://api.open-meteo.com") 
        };

        _mockOrsClient.Setup(o => o.GetCoordinatesAsync("Vienna")).ReturnsAsync((16.37, 48.20));

        var weatherService = new WeatherService(httpClient, _mockOrsClient.Object);

        // Act
        var result = await weatherService.GetWeatherAsync("Vienna");

        // Assert
        Assert.That(result.Condition, Is.EqualTo("Unknown"), "Should safely fallback to 'Unknown' for unexpected WMO codes.");
    }
}