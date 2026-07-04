namespace TourPlannerAPI.Models
{
    public class UserStatsAggregate
    {
        public string? FavoriteTransport { get; set; }
        public string? ToughestTourName { get; set; }
        public int UniqueLocations { get; set; }
        public double AverageSpeedKmH { get; set; }
    }

    public class StatItemModel
    {
        public string Icon { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}