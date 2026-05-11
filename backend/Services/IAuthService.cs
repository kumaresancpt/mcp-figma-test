namespace backend.Services;

using backend.Models;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, string ipAddress);
    Task LogoutAsync(string userId);
    Task<UserResponse> GetCurrentUserAsync(string userId);
    Task ForgotPasswordAsync(string usernameOrEmail);
    Task ResetPasswordAsync(ResetPasswordRequest request);
    Task<UserResponse> SignUpAsync(SignUpRequest request, string adminUserId);
    Task<User?> ValidateUserAsync(string username, string password, string ipAddress);
    Task LogAuditAsync(string? userId, AuditAction action, string? role, string ipAddress);
}
