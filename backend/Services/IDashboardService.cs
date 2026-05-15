namespace backend.Services;

using backend.Models;

public interface IDashboardService
{
    Task<DashboardStatsResponse> GetStatsAsync();
    Task<List<TrendItem>> GetTrendsAsync(int days);
    Task<List<PurposeItem>> GetPurposesAsync();
}
