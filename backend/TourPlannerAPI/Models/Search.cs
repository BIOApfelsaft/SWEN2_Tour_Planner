namespace TourPlannerAPI.Models.Search;

public class SearchResultModel
{
    public List<TourSearchModel> Tours { get; set; } = new();
    public List<LogSearchModel> Logs { get; set; } = new();
}

public class TourSearchModel
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
}

public class LogSearchModel
{
    public int Id { get; set; }
    public int TourId { get; set; }
    public string? Comment { get; set; }
    public required string TourTitle { get; set; }
}