namespace backend.Services;

using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsResponse> GetStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        var visitorsToday = await _context.Visitors.CountAsync(v => v.CreatedAt >= today && v.CreatedAt < tomorrow);
        var activeVisitors = await _context.Visitors.CountAsync(v => v.Status == VisitorStatus.checked_in);
        var pendingApprovals = await _context.Visitors.CountAsync(v => v.Status == VisitorStatus.pending_approval);
        var overstayAlerts = await _context.Visitors.CountAsync(v => v.Status == VisitorStatus.checked_in && v.CheckInTime.HasValue && v.CheckInTime.Value < DateTime.UtcNow.AddHours(-8));
        return new DashboardStatsResponse { VisitorsToday = visitorsToday, ActiveVisitors = activeVisitors, PendingApprovals = pendingApprovals, OverstayAlerts = overstayAlerts };
    }

    public async Task<List<TrendItem>> GetTrendsAsync(int days)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-days + 1);
        var visitors = await _context.Visitors.Where(v => v.CreatedAt >= startDate).ToListAsync();
        var grouped = visitors.GroupBy(v => v.CreatedAt.Date).ToDictionary(g => g.Key, g => g.Count());
        var result = new List<TrendItem>();
        for (int i = 0; i < days; i++)
        {
            var date = startDate.AddDays(i);
            result.Add(new TrendItem { Date = date.ToString("MMM dd"), Count = grouped.TryGetValue(date, out var count) ? count : 0 });
        }
        return result;
    }

    public async Task<List<PurposeItem>> GetPurposesAsync()
    {
        var purposes = await _context.Visitors.GroupBy(v => v.Purpose).Select(g => new PurposeItem { Purpose = g.Key, Count = g.Count() }).ToListAsync();
        return purposes;
    }
}
