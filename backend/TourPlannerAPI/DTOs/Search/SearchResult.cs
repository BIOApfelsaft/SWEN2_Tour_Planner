namespace TourPlannerAPI.DTOs.Search;

public class SearchResult
{
    public List<TourSearchResult> Tours { get; set; } = [];
    public List<LogSearchResult> Logs { get; set; } = [];
}

public class TourSearchResult
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
}

public class LogSearchResult
{
    public int Id { get; set; }
    public int TourId { get; set; }
    public string? Comment { get; set; }
    public required string TourTitle { get; set; }
}