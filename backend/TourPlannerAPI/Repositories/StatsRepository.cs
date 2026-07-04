using Microsoft.EntityFrameworkCore;
using TourPlannerAPI.Data;
using TourPlannerAPI.Models;

namespace TourPlannerAPI.Repositories
{
    public class StatsRepository(AppDbContext context) : IStatsRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<UserStatsAggregate> GetUserStatsAsync(int userId)
        {
            var aggregate = new UserStatsAggregate
            {
                FavoriteTransport = await _context.Tours
                    .Where(t => t.UserId == userId)
                    .GroupBy(t => t.TransportType)
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .FirstOrDefaultAsync()
            };

            var toughestLog = await _context.TourLogs
                .Include(l => l.Tour)
                .Where(l => l.Tour!.UserId == userId)
                .OrderByDescending(l => l.Difficulty)
                .FirstOrDefaultAsync();
            aggregate.ToughestTourName = toughestLog?.Tour?.Title;

            var startLocs = await _context.Tours.Where(t => t.UserId == userId).Select(t => t.StartLocation).ToListAsync();
            var endLocs = await _context.Tours.Where(t => t.UserId == userId).Select(t => t.EndLocation).ToListAsync();
            aggregate.UniqueLocations = startLocs.Concat(endLocs).Distinct().Count();

            var logs = await _context.TourLogs.Where(l => l.Tour!.UserId == userId && l.TotalTime > 0).ToListAsync();
            if (logs.Count != 0)
            {
                double totalKm = (double)logs.Sum(l => l.TotalDistance);
                double totalHours = logs.Sum(l => l.TotalTime) / 3600.0;
                aggregate.AverageSpeedKmH = totalHours > 0 ? (totalKm / totalHours) : 0;
            }

            return aggregate;
        }
    }
}