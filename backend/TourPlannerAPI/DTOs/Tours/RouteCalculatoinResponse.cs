namespace TourPlannerAPI.DTOs.Tours;

public class RouteCalculationResponse
{
    public decimal Distance { get; set; }
    public int EstimatedTime { get; set; }
    public string? GeoJson { get; set; }
}