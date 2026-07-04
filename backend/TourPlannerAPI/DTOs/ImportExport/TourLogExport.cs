namespace TourPlannerAPI.DTOs.ImportExport;
public class TourLogExport
{
    public DateTime LogDateTime { get; set; }
    public string? Comment { get; set; }
    public int Difficulty { get; set; }
    public int TotalTime { get; set; }
    public decimal TotalDistance { get; set; }
    public int Rating { get; set; }
}