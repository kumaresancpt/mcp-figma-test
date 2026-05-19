namespace backend.Services;

using backend.Models;

public interface IRegisterService
{
    Task<(bool Success, string? Error, string? Field)> RegisterAsync(RegisterRequest request);
}
