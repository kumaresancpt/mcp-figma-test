namespace backend.Services;

using backend.Models;

public interface IVisitorService
{
    Task<PaginatedVisitorResponse> GetVisitorsAsync(int page, int limit, string? status, string? search);
    Task<VisitorResponse> GetVisitorByIdAsync(Guid id);
    Task<VisitorResponse> CreateVisitorAsync(CreateVisitorRequest request, Guid createdBy);
    Task<VisitorResponse> UpdateVisitorAsync(Guid id, UpdateVisitorRequest request);
    Task DeleteVisitorAsync(Guid id);
    Task<VisitorResponse> CheckInAsync(Guid id);
    Task<VisitorResponse> CheckOutAsync(Guid id);
    Task<List<object>> SearchAsync(string query);
}
