namespace TourPlannerAPI.DTOs;

public class CreateTourLogDto
{
    public int TourId { get; set; }
    public DateTime LogDateTime { get; set; }
    public string? Comment { get; set; }
    public int Difficulty { get; set; }
    public decimal TotalDistance { get; set; }
    public int TotalTime { get; set; }
    public int Rating { get; set; }
    public string? WeatherCondition { get; set; }
    public decimal? Temperature { get; set; }
}