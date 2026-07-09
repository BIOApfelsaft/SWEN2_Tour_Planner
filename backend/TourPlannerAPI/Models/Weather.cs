namespace TourPlannerAPI.Models;

public class Weather
{
    public double Temperature { get; set; }
    public string Condition { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}
