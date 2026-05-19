using Backend.Models.Visitor;
using Backend.Services.Visitor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VisitorsController : ControllerBase
    {
        private readonly IVisitorService _visitorService;
        private readonly ILogger<VisitorsController> _logger;

        public VisitorsController(IVisitorService visitorService, ILogger<VisitorsController> logger)
        {
            _visitorService = visitorService ?? throw new ArgumentNullException(nameof(visitorService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        [ProducesResponseType(typeof(PaginatedResponse<VisitorResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAllVisitors(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? sort = null,
            [FromQuery] string? filter = null)
        {
            try
            {
                if (page < 1 || limit < 1)
                {
                    return BadRequest(new ErrorResponse { Detail = "Page and limit must be positive integers" });
                }

                var (visitors, total) = await _visitorService.GetAllVisitorsAsync(page, limit, sort, filter);

                var pages = (int)Math.Ceiling(total / (double)limit);
                var response = new PaginatedResponse<VisitorResponse>
                {
                    Data = visitors,
                    Total = total,
                    Page = page,
                    Pages = pages
                };

                _logger.LogInformation($"Retrieved visitors page {page}, total: {total}");
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving visitors: {ex.Message}");
                return BadRequest(new ErrorResponse { Detail = "Failed to retrieve visitors" });
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(VisitorResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetVisitorById(Guid id)
        {
            try
            {
                var visitor = await _visitorService.GetVisitorByIdAsync(id);
                if (visitor == null)
                {
                    return NotFound(new ErrorResponse { Detail = $"Visitor with ID {id} not found" });
                }

                _logger.LogInformation($"Retrieved visitor {id}");
                return Ok(visitor);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving visitor {id}: {ex.Message}");
                return BadRequest(new ErrorResponse { Detail = "Failed to retrieve visitor" });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(VisitorResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateVisitor([FromBody] CreateVisitorRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new ErrorResponse { Detail = string.Join("; ", errors) });
                }

                var visitor = await _visitorService.CreateVisitorAsync(request);
                _logger.LogInformation($"Created new visitor {visitor.Id}");

                return CreatedAtAction(nameof(GetVisitorById), new { id = visitor.Id }, visitor);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating visitor: {ex.Message}");
                return BadRequest(new ErrorResponse { Detail = "Failed to create visitor" });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(VisitorResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateVisitor(Guid id, [FromBody] UpdateVisitorRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new ErrorResponse { Detail = string.Join("; ", errors) });
                }

                var visitor = await _visitorService.UpdateVisitorAsync(id, request);
                if (visitor == null)
                {
                    return NotFound(new ErrorResponse { Detail = $"Visitor with ID {id} not found" });
                }

                _logger.LogInformation($"Updated visitor {id}");
                return Ok(visitor);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating visitor {id}: {ex.Message}");
                return BadRequest(new ErrorResponse { Detail = "Failed to update visitor" });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(DeleteResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteVisitor(Guid id)
        {
            try
            {
                var result = await _visitorService.DeleteVisitorAsync(id);
                if (!result)
                {
                    return NotFound(new ErrorResponse { Detail = $"Visitor with ID {id} not found" });
                }

                _logger.LogInformation($"Deleted visitor {id}");
                return Ok(new DeleteResponse { Message = "Visitor deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting visitor {id}: {ex.Message}");
                return BadRequest(new ErrorResponse { Detail = "Failed to delete visitor" });
            }
        }
    }

    public class PaginatedResponse<T>
    {
        public List<T> Data { get; set; } = new();
        public int Total { get; set; }
        public int Page { get; set; }
        public int Pages { get; set; }
    }

    public class ErrorResponse
    {
        public string Detail { get; set; } = string.Empty;
    }

    public class DeleteResponse
    {
        public string Message { get; set; } = string.Empty;
    }
}