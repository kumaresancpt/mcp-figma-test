namespace backend.Services;

using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

public class VisitorService : IVisitorService
{
    private readonly AppDbContext _context;

    public VisitorService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedVisitorResponse> GetVisitorsAsync(int page, int limit, string? status, string? search)
    {
        var query = _context.Visitors.Include(v => v.Host).Include(v => v.Badge).AsQueryable();
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<VisitorStatus>(status, out var statusEnum))
            query = query.Where(v => v.Status == statusEnum);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(v => v.Name.Contains(search) || (v.Company != null && v.Company.Contains(search)));
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(v => v.CreatedAt).Skip((page - 1) * limit).Take(limit).ToListAsync();
        return new PaginatedVisitorResponse { Items = items.Select(VisitorResponse.FromVisitor).ToList(), Total = total, Page = page, Limit = limit };
    }

    public async Task<VisitorResponse> GetVisitorByIdAsync(Guid id)
    {
        var visitor = await _context.Visitors.Include(v => v.Host).Include(v => v.Badge).FirstOrDefaultAsync(v => v.Id == id);
        if (visitor == null) throw new KeyNotFoundException("Visitor not found");
        return VisitorResponse.FromVisitor(visitor);
    }

    public async Task<VisitorResponse> CreateVisitorAsync(CreateVisitorRequest request, Guid createdBy)
    {
        var visitor = new Visitor
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Company = request.Company,
            HostId = request.HostId,
            Purpose = request.Purpose,
            ScheduledTime = request.ScheduledTime,
            Status = VisitorStatus.waiting,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.Visitors.Add(visitor);
        var badge = new Badge { Id = Guid.NewGuid(), VisitorId = visitor.Id, BadgeType = BadgeType.pending, GeneratedAt = DateTime.UtcNow };
        _context.Badges.Add(badge);
        await _context.SaveChangesAsync();
        return await GetVisitorByIdAsync(visitor.Id);
    }

    public async Task<VisitorResponse> UpdateVisitorAsync(Guid id, UpdateVisitorRequest request)
    {
        var visitor = await _context.Visitors.FindAsync(id);
        if (visitor == null) throw new KeyNotFoundException("Visitor not found");
        if (request.Name != null) visitor.Name = request.Name;
        if (request.Company != null) visitor.Company = request.Company;
        if (request.HostId.HasValue) visitor.HostId = request.HostId;
        if (request.Purpose != null) visitor.Purpose = request.Purpose;
        if (request.ScheduledTime.HasValue) visitor.ScheduledTime = request.ScheduledTime;
        visitor.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return await GetVisitorByIdAsync(id);
    }

    public async Task DeleteVisitorAsync(Guid id)
    {
        var visitor = await _context.Visitors.FindAsync(id);
        if (visitor == null) throw new KeyNotFoundException("Visitor not found");
        _context.Visitors.Remove(visitor);
        await _context.SaveChangesAsync();
    }

    public async Task<VisitorResponse> CheckInAsync(Guid id)
    {
        var visitor = await _context.Visitors.FindAsync(id);
        if (visitor == null) throw new KeyNotFoundException("Visitor not found");
        visitor.Status = VisitorStatus.checked_in;
        visitor.CheckInTime = DateTime.UtcNow;
        visitor.UpdatedAt = DateTime.UtcNow;
        if (visitor.Badge != null)
        {
            var badge = await _context.Badges.FirstOrDefaultAsync(b => b.VisitorId == id);
            if (badge != null) { badge.BadgeType = BadgeType.qr_generated; badge.QrCodeData = Guid.NewGuid().ToString(); }
        }
        await _context.SaveChangesAsync();
        return await GetVisitorByIdAsync(id);
    }

    public async Task<VisitorResponse> CheckOutAsync(Guid id)
    {
        var visitor = await _context.Visitors.FindAsync(id);
        if (visitor == null) throw new KeyNotFoundException("Visitor not found");
        visitor.Status = VisitorStatus.checked_out;
        visitor.CheckOutTime = DateTime.UtcNow;
        visitor.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return await GetVisitorByIdAsync(id);
    }

    public async Task<List<object>> SearchAsync(string query)
    {
        var visitors = await _context.Visitors.Include(v => v.Host)
            .Where(v => v.Name.Contains(query) || (v.Company != null && v.Company.Contains(query)) || (v.Host != null && v.Host.Name.Contains(query)))
            .Take(10).ToListAsync();
        return visitors.Select(v => (object)VisitorResponse.FromVisitor(v)).ToList();
    }
}
