using Microsoft.EntityFrameworkCore;
using TourPlannerAPI.Data;
using TourPlannerAPI.Models.Search;

namespace TourPlannerAPI.Repositories
{
    public class SearchRepository(AppDbContext context) : ISearchRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<SearchResultModel> SearchAsync(string term, string type)
        {
            var result = new SearchResultModel();
            
            var searchTerm = $"%{term}%"; 

            if (type is "global" or "tour")
            {
                result.Tours = await _context.Tours
                    .Where(t => EF.Functions.ILike(t.Title, searchTerm) || 
                            (t.Description != null && EF.Functions.ILike(t.Description, searchTerm)) ||
                            EF.Functions.ILike(t.StartLocation, searchTerm) ||
                            EF.Functions.ILike(t.EndLocation, searchTerm))
                    .Select(t => new TourSearchModel
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Description = t.Description
                    })
                    .Take(10)
                    .ToListAsync();
            }

            if (type is "global" or "log")
            {
                result.Logs = await _context.TourLogs
                    .Include(l => l.Tour)
                    .Where(l => l.Comment != null && EF.Functions.ILike(l.Comment, searchTerm))
                    .Select(l => new LogSearchModel
                    {
                        Id = l.Id,
                        TourId = l.TourId,
                        Comment = l.Comment,
                        TourTitle = l.Tour!.Title
                    })
                    .Take(10)
                    .ToListAsync();
            }

            return result;
        }
    }
}