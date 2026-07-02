namespace TourPlannerAPI.DTOs.Tours;

public class TourResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string StartLocation { get; set; } = string.Empty;
    public string EndLocation { get; set; } = string.Empty;
    public string TransportType { get; set; } = string.Empty;
    public decimal Distance { get; set; }
    public double EstimatedTime { get; set; }
    public string? MapImagePath { get; set; }
    public string? RouteGeojson { get; set; } 
    public decimal ComputedPopularityScore { get; set; }
    public decimal ComputedChildFriendlyScore { get; set; }
}