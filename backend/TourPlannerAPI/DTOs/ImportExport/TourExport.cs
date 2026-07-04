namespace TourPlannerAPI.DTOs.ImportExport;

public class TourExport
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string StartLocation { get; set; } = string.Empty;
    public string EndLocation { get; set; } = string.Empty;
    public string TransportType { get; set; } = string.Empty;
    public decimal Distance { get; set; }
    public int EstimatedTime { get; set; }
    public string? RouteGeojson { get; set; }
    
    public List<TourLogExport> Logs { get; set; } = new();
}