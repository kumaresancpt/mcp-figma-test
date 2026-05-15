namespace backend.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

[ApiController]
[Route("api/visitors")]
[Authorize]
public class VisitorsController : ControllerBase
{
    private readonly IVisitorService _visitorService;
    private readonly ILogger<VisitorsController> _logger;

    public VisitorsController(IVisitorService visitorService, ILogger<VisitorsController> logger)
    {
        _visitorService = visitorService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult> GetVisitors([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? status = null, [FromQuery] string? search = null)
    {
        try { return Ok(await _visitorService.GetVisitorsAsync(page, limit, status, search)); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting visitors"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetVisitor(Guid id)
    {
        try { return Ok(await _visitorService.GetVisitorByIdAsync(id)); }
        catch (KeyNotFoundException) { return NotFound(new { detail = "Visitor not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting visitor"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpPost]
    public async Task<ActionResult> CreateVisitor([FromBody] CreateVisitorRequest request)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(new { detail = "Invalid request" });
            var userId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            var visitor = await _visitorService.CreateVisitorAsync(request, Guid.Parse(userId));
            return CreatedAtAction(nameof(GetVisitor), new { id = visitor.Id }, visitor);
        }
        catch (Exception ex) { _logger.LogError(ex, "Error creating visitor"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateVisitor(Guid id, [FromBody] UpdateVisitorRequest request)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(new { detail = "Invalid request" });
            return Ok(await _visitorService.UpdateVisitorAsync(id, request));
        }
        catch (KeyNotFoundException) { return NotFound(new { detail = "Visitor not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error updating visitor"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<ActionResult> DeleteVisitor(Guid id)
    {
        try { await _visitorService.DeleteVisitorAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(new { detail = "Visitor not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error deleting visitor"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpPost("{id}/checkin")]
    public async Task<ActionResult> CheckIn(Guid id)
    {
        try { return Ok(await _visitorService.CheckInAsync(id)); }
        catch (KeyNotFoundException) { return NotFound(new { detail = "Visitor not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error checking in visitor"); return StatusCode(500, new { detail = "Internal server error" }); }
    }

    [HttpPost("{id}/checkout")]
    public async Task<ActionResult> CheckOut(Guid id)
    {
        try { return Ok(await _visitorService.CheckOutAsync(id)); }
        catch (KeyNotFoundException) { return NotFound(new { detail = "Visitor not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error checking out visitor"); return StatusCode(500, new { detail = "Internal server error" }); }
    }
}
