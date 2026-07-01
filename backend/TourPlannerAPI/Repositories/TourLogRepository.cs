using TourPlannerAPI.Data;
using TourPlannerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace TourPlannerAPI.Repositories
{
    public class TourLogRepository(AppDbContext context) : ITourLogRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<IEnumerable<TourLog>> GetTourLogsAsync(int tourId)
        {
            return await _context.TourLogs.Where(tl => tl.TourId == tourId).ToListAsync();
        }

        public async Task<TourLog?> GetTourLogByIdAsync(int id)
        {
            return await _context.TourLogs.FindAsync(id);
        }

        public async Task AddTourLogAsync(TourLog tourLog)
        {
            _context.TourLogs.Add(tourLog);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTourLogAsync(TourLog tourLog)
        {
            _context.Entry(tourLog).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTourLogAsync(int id)
        {
            var tourLog = await _context.TourLogs.FindAsync(id);
            if (tourLog != null)
            {
                _context.TourLogs.Remove(tourLog);
                await _context.SaveChangesAsync();
            }
        }
    }
}