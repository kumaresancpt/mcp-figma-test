using backend.Data;
using Backend.Models.Visitor;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Visitor
{
    public class VisitorService : IVisitorService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<VisitorService> _logger;

        public VisitorService(AppDbContext context, ILogger<VisitorService> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<(List<VisitorResponse> visitors, int total)> GetAllVisitorsAsync(int page = 1, int limit = 10, string? sort = null, string? filter = null)
        {
            try
            {
                if (page < 1) page = 1;
                if (limit < 1) limit = 10;
                if (limit > 100) limit = 100;

                var query = _context.Visitors.AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter))
                {
                    query = ApplyFilter(query, filter);
                }

                var total = await query.CountAsync();
                query = ApplySort(query, sort);

                var visitors = await query
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .ToListAsync();

                var response = visitors.Select(MapToResponse).ToList();
                _logger.LogInformation($"Retrieved {response.Count} visitors from page {page}");

                return (response, total);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving visitors: {ex.Message}");
                throw;
            }
        }

        public async Task<VisitorResponse?> GetVisitorByIdAsync(Guid id)
        {
            try
            {
                var visitor = await _context.Visitors.FirstOrDefaultAsync(v => v.Id == id);
                if (visitor == null)
                {
                    _logger.LogWarning($"Visitor with ID {id} not found");
                    return null;
                }

                return MapToResponse(visitor);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving visitor {id}: {ex.Message}");
                throw;
            }
        }

        public async Task<VisitorResponse> CreateVisitorAsync(CreateVisitorRequest request)
        {
            try
            {
                var visitor = new Backend.Models.Visitor.Visitor
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Company = request.Company,
                    Host = request.Host,
                    Purpose = request.Purpose,
                    CheckInTime = request.CheckInTime,
                    VisitorImage = request.VisitorImage,
                    PhoneNumber = request.PhoneNumber,
                    Email = request.Email,
                    Notes = request.Notes,
                    Status = VisitorStatus.CheckIn,
                    Badge = BadgeStatus.NoBadge,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Visitors.Add(visitor);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Visitor created with ID {visitor.Id}");
                return MapToResponse(visitor);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating visitor: {ex.Message}");
                throw;
            }
        }

        public async Task<VisitorResponse?> UpdateVisitorAsync(Guid id, UpdateVisitorRequest request)
        {
            try
            {
                var visitor = await _context.Visitors.FirstOrDefaultAsync(v => v.Id == id);
                if (visitor == null)
                {
                    _logger.LogWarning($"Visitor with ID {id} not found for update");
                    return null;
                }

                if (!string.IsNullOrWhiteSpace(request.Name))
                    visitor.Name = request.Name;

                if (!string.IsNullOrWhiteSpace(request.Company))
                    visitor.Company = request.Company;

                if (!string.IsNullOrWhiteSpace(request.Host))
                    visitor.Host = request.Host;

                if (!string.IsNullOrWhiteSpace(request.Purpose))
                    visitor.Purpose = request.Purpose;

                if (request.Status.HasValue)
                    visitor.Status = request.Status.Value;

                if (request.Badge.HasValue)
                    visitor.Badge = request.Badge.Value;

                if (request.CheckOutTime.HasValue)
                    visitor.CheckOutTime = request.CheckOutTime.Value;

                if (!string.IsNullOrWhiteSpace(request.Notes))
                    visitor.Notes = request.Notes;

                visitor.UpdatedAt = DateTime.UtcNow;

                _context.Visitors.Update(visitor);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Visitor {id} updated successfully");
                return MapToResponse(visitor);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating visitor {id}: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteVisitorAsync(Guid id)
        {
            try
            {
                var visitor = await _context.Visitors.FirstOrDefaultAsync(v => v.Id == id);
                if (visitor == null)
                {
                    _logger.LogWarning($"Visitor with ID {id} not found for deletion");
                    return false;
                }

                _context.Visitors.Remove(visitor);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Visitor {id} deleted successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting visitor {id}: {ex.Message}");
                throw;
            }
        }

        private VisitorResponse MapToResponse(Backend.Models.Visitor.Visitor visitor)
        {
            return new VisitorResponse
            {
                Id = visitor.Id,
                Name = visitor.Name,
                Company = visitor.Company,
                Host = visitor.Host,
                Purpose = visitor.Purpose,
                CheckInTime = visitor.CheckInTime,
                CheckOutTime = visitor.CheckOutTime,
                Status = visitor.Status.ToString(),
                Badge = visitor.Badge.ToString(),
                VisitorImage = visitor.VisitorImage,
                PhoneNumber = visitor.PhoneNumber,
                Email = visitor.Email,
                Notes = visitor.Notes,
                CreatedAt = visitor.CreatedAt,
                UpdatedAt = visitor.UpdatedAt
            };
        }

        private IQueryable<Backend.Models.Visitor.Visitor> ApplySort(IQueryable<Backend.Models.Visitor.Visitor> query, string? sort)
        {
            if (string.IsNullOrWhiteSpace(sort))
            {
                return query.OrderByDescending(v => v.CheckInTime);
            }

            return sort.ToLower() switch
            {
                "name_asc" => query.OrderBy(v => v.Name),
                "name_desc" => query.OrderByDescending(v => v.Name),
                "checkin_asc" => query.OrderBy(v => v.CheckInTime),
                "checkin_desc" => query.OrderByDescending(v => v.CheckInTime),
                "status_asc" => query.OrderBy(v => v.Status),
                "status_desc" => query.OrderByDescending(v => v.Status),
                _ => query.OrderByDescending(v => v.CheckInTime)
            };
        }

        private IQueryable<Backend.Models.Visitor.Visitor> ApplyFilter(IQueryable<Backend.Models.Visitor.Visitor> query, string filter)
        {
            var parts = filter.Split(':');
            if (parts.Length != 2)
            {
                return query;
            }

            var filterType = parts[0].ToLower();
            var filterValue = parts[1].ToLower();

            return filterType switch
            {
                "status" => query.Where(v => v.Status.ToString().ToLower() == filterValue),
                "badge" => query.Where(v => v.Badge.ToString().ToLower() == filterValue),
                "name" => query.Where(v => v.Name.ToLower().Contains(filterValue)),
                "company" => query.Where(v => v.Company.ToLower().Contains(filterValue)),
                "host" => query.Where(v => v.Host.ToLower().Contains(filterValue)),
                _ => query
            };
        }
    }
}