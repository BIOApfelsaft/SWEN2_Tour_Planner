using System.ComponentModel.DataAnnotations;

namespace TourPlannerAPI.DTOs.Tours;

public class CreateTourRequest
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(100)]
    public string Title { get; set; } = null!;

    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required(ErrorMessage = "Start location is required.")]
    [MaxLength(100)]
    public string StartLocation { get; set; } = null!;

    public double StartLng { get; set; }
    public double StartLat { get; set; }
    
    [Required(ErrorMessage = "End location is required.")]
    [MaxLength(100)]
    public string EndLocation { get; set; } = null!;

    public double EndLng { get; set; }
    public double EndLat { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string TransportType { get; set; } = null!;

    [MaxLength(255)]
    public string? MapImagePath { get; set; }
}