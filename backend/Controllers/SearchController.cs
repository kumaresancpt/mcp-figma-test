namespace backend.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

[ApiController]
[Route("api/search")]
[Authorize]
public class SearchController : ControllerBase
{
    private readonly IVisitorService _visitorService;
    private readonly ILogger<SearchController> _logger;

    public SearchController(IVisitorService visitorService, ILogger<SearchController> logger)
    {
        _visitorService = visitorService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult> Search([FromQuery] string q = "")
    {
        if (string.IsNullOrWhiteSpace(q)) return Ok(new { results = new List<object>() });
        try { var results = await _visitorService.SearchAsync(q); return Ok(new { results }); }
        catch (Exception ex) { _logger.LogError(ex, "Error searching"); return StatusCode(500, new { detail = "Internal server error" }); }
    }
}
