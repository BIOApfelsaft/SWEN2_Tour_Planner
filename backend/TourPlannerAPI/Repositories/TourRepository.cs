using TourPlannerAPI.Data;
using TourPlannerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace TourPlannerAPI.Repositories;

public class TourRepository : ITourRepository
{
    private readonly AppDbContext _context;

    public TourRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Tour>> GetAllToursAsync()
    {
        return await _context.Tours.ToListAsync();
    }

    public async Task<Tour> GetTourByIdAsync(int id)
    {
        return await _context.Tours.FindAsync(id);
    }

    public async Task<Tour> CreateTourAsync(Tour tour)
    {
        _context.Tours.Add(tour);
        await _context.SaveChangesAsync();
        return tour;
    }

    public async Task UpdateTourAsync(Tour tour)
    {
        _context.Entry(tour).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTourAsync(int id)
    {
        var tour = await _context.Tours.FindAsync(id);
        if (tour != null)
        {
            _context.Tours.Remove(tour);
            await _context.SaveChangesAsync();
        }
    }
}