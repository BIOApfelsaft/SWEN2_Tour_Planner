using Microsoft.EntityFrameworkCore;
using TourPlannerAPI.Data;
using TourPlannerAPI.Models;

namespace TourPlannerAPI.Repositories
{
    public class ImportExportRepository(AppDbContext context) : IImportExportRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<List<Tour>> GetToursWithLogsAsync(List<int> tourIds)
        {
            return await _context.Tours
                .Include(t => t.TourLogs)
                .Where(t => tourIds.Contains(t.Id))
                .ToListAsync();
        }

        public async Task AddToursAsync(List<Tour> tours)
        {
            await _context.Tours.AddRangeAsync(tours);
            await _context.SaveChangesAsync();
        }
    }
}