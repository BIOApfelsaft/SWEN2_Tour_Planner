using System.ComponentModel.DataAnnotations;

namespace TourPlannerAPI.DTOs.TourLogs;

public class CreateTourLogRequest
{
    [Required]
    public int TourId { get; set; }

    [Required]
    public DateTime LogDateTime { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "Difficulty must be between 1 and 5.")]
    public int Difficulty { get; set; }

    [Required]
    [Range(0, 10000, ErrorMessage = "Total distance must be a positive number.")]
    public decimal TotalDistance { get; set; }

    [Required]
    [Range(0, 86400, ErrorMessage = "Total time must be positive (in seconds).")]
    public int TotalTime { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int Rating { get; set; }

    [MaxLength(50)]
    public string? WeatherCondition { get; set; }

    [Range(-50, 60, ErrorMessage = "Temperature is out of valid bounds.")]
    public decimal? Temperature { get; set; }
}