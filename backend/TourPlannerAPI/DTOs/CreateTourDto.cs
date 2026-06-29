namespace TourPlannerAPI.DTOs;
public class CreateTourDto
{
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    
    public string StartLocation { get; set; } = null!;
    public double StartLng { get; set; }
    public double StartLat { get; set; }
    
    public string EndLocation { get; set; } = null!;
    public double EndLng { get; set; }
    public double EndLat { get; set; }
    
    public string TransportType { get; set; } = null!;
    public string? MapImagePath { get; set; }
}