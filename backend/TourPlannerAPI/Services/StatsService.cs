using TourPlannerAPI.Models;
using TourPlannerAPI.Repositories;

namespace TourPlannerAPI.Services
{
    public class StatsService(IStatsRepository statsRepository) : IStatsService
    {
        private readonly IStatsRepository _statsRepository = statsRepository;

        public async Task<List<StatItemModel>> GetFunFactsAsync(int userId)
        {
            var data = await _statsRepository.GetUserStatsAsync(userId);
            var result = new List<StatItemModel>();

            // 1. Favorite Transport
            string transportIcon = data.FavoriteTransport?.ToLower() switch
            {
                "bicycle" or "mtb" => "directions_bike",
                "car" => "directions_car",
                "foot" or "walking" or "hiking" => "directions_walk",
                _ => "commute"
            };
            result.Add(new StatItemModel { 
                Icon = transportIcon, 
                Label = "Favorite Transport", 
                Value = string.IsNullOrEmpty(data.FavoriteTransport) ? "None yet" : data.FavoriteTransport 
            });

            // 2. Toughest Challenge
            result.Add(new StatItemModel { 
                Icon = "local_fire_department", 
                Label = "Toughest Tour", 
                Value = string.IsNullOrEmpty(data.ToughestTourName) ? "None yet" : data.ToughestTourName 
            });

            // 3. Explorer Score
            result.Add(new StatItemModel { 
                Icon = "explore", 
                Label = "Unique Places", 
                Value = $"{data.UniqueLocations} places" 
            });

            // 4. Average Pace
            result.Add(new StatItemModel { 
                Icon = "speed", 
                Label = "Average Pace", 
                Value = data.AverageSpeedKmH > 0 ? $"{data.AverageSpeedKmH:F1} km/h" : "0 km/h" 
            });

            return result;
        }
    }
}