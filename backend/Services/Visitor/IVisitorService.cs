using Backend.Models.Visitor;

namespace Backend.Services.Visitor
{
    public interface IVisitorService
    {
        Task<(List<VisitorResponse> visitors, int total)> GetAllVisitorsAsync(int page = 1, int limit = 10, string? sort = null, string? filter = null);
        Task<VisitorResponse?> GetVisitorByIdAsync(Guid id);
        Task<VisitorResponse> CreateVisitorAsync(CreateVisitorRequest request);
        Task<VisitorResponse?> UpdateVisitorAsync(Guid id, UpdateVisitorRequest request);
        Task<bool> DeleteVisitorAsync(Guid id);
    }
}