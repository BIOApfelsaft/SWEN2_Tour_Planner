public class CreateTourDto
{
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string StartLocation { get; set; } = null!;
    public string EndLocation { get; set; } = null!;
    public string TransportType { get; set; } = null!;
    public decimal Distance { get; set; }
    public int EstimatedTime { get; set; }
    public string? MapImagePath { get; set; }
    public string? RouteGeojson { get; set; }
}