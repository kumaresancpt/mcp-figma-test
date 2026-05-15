namespace backend.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        try { return Ok(await _dashboardService.GetStatsAsync()); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting dashboard stats"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpGet("trends")]
    public async Task<ActionResult> GetTrends([FromQuery] int days = 7)
    {
        if (days < 1 || days > 90) days = 7;
        try { return Ok(await _dashboardService.GetTrendsAsync(days)); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting visitor trends"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpGet("purposes")]
    public async Task<ActionResult> GetPurposes()
    {
        try { return Ok(await _dashboardService.GetPurposesAsync()); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting visit purposes"); return StatusCode(500, new { detail = "Internal server error" }); }
    }
}
