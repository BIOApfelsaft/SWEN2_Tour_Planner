using System;
using System.Collections.Generic;
using TourPlannerAPI.Models;

namespace TourPlannerAPI.Models;

public partial class Tour
{
    public int Id { get; set; }

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

    public decimal ComputedPopularityScore { get; set; }

    public decimal ComputedChildFriendlyScore { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<TourLog> TourLogs { get; set; } = new List<TourLog>();

    public virtual User User { get; set; } = null!;
}
