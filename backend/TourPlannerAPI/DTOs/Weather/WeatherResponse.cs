namespace TourPlannerAPI.DTOs.Weather;

public class WeatherResponse
{
    public double Temperature { get; set; }
    public string Condition { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}