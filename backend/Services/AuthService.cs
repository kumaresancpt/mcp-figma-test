namespace backend.Services;

using System;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(AppDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, string ipAddress)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null) { await LogAuditAsync(null, AuditAction.FAILED_LOGIN, request.Role, ipAddress); throw new UnauthorizedAccessException("Invalid username or password"); }
        if (user.LockedUntil.HasValue && user.LockedUntil > DateTime.UtcNow) { await LogAuditAsync(user.Id.ToString(), AuditAction.ACCOUNT_LOCKED, request.Role, ipAddress); throw new InvalidOperationException("Account locked due to too many failed attempts. Try again later."); }
        if (!user.IsActive) { await LogAuditAsync(user.Id.ToString(), AuditAction.FAILED_LOGIN, request.Role, ipAddress); throw new UnauthorizedAccessException("Account is inactive"); }
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            user.FailedAttempts++;
            if (user.FailedAttempts >= 5) user.LockedUntil = DateTime.UtcNow.AddMinutes(15);
            await _context.SaveChangesAsync();
            await LogAuditAsync(user.Id.ToString(), AuditAction.FAILED_LOGIN, request.Role, ipAddress);
            throw new UnauthorizedAccessException("Invalid username or password");
        }
        user.FailedAttempts = 0;
        user.LockedUntil = null;
        user.UpdatedAt = DateTime.UtcNow;
        var accessToken = GenerateJwtToken(user);
        var session = new Session { Id = Guid.NewGuid(), UserId = user.Id, TokenHash = HashToken(accessToken), IsPersistent = request.KeepLoggedIn, ExpiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60")), IpAddress = ipAddress };
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();
        await LogAuditAsync(user.Id.ToString(), AuditAction.LOGIN, user.Role.ToString(), ipAddress);
        return new LoginResponse { AccessToken = accessToken, TokenType = "Bearer", ExpiresIn = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60") * 60, RefreshToken = request.KeepLoggedIn ? GenerateRandomToken() : null };
    }

    public async Task LogoutAsync(string userId)
    {
        var sessions = await _context.Sessions.Where(s => s.UserId == Guid.Parse(userId) && s.RevokedAt == null).ToListAsync();
        foreach (var session in sessions) session.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        await LogAuditAsync(userId, AuditAction.LOGOUT, null, "");
    }

    public async Task<UserResponse> GetCurrentUserAsync(string userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));
        if (user == null) throw new KeyNotFoundException("User not found");
        return UserResponse.FromUser(user);
    }

    public async Task ForgotPasswordAsync(string usernameOrEmail)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail);
        if (user != null)
        {
            var resetToken = GenerateRandomToken();
            _context.PasswordResetTokens.Add(new PasswordResetToken { Id = Guid.NewGuid(), UserId = user.Id, TokenHash = HashToken(resetToken), ExpiresAt = DateTime.UtcNow.AddMinutes(15) });
            await _context.SaveChangesAsync();
            _logger.LogInformation("Reset token (demo): {ResetToken}", resetToken);
        }
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var tokenHash = HashToken(request.ResetToken);
        var resetToken = await _context.PasswordResetTokens.Include(rt => rt.User).FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);
        if (resetToken == null || resetToken.ExpiresAt < DateTime.UtcNow || resetToken.UsedAt.HasValue) throw new UnauthorizedAccessException("Invalid or expired reset token");
        var user = resetToken.User ?? throw new KeyNotFoundException("User not found");
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);
        user.UpdatedAt = DateTime.UtcNow;
        resetToken.UsedAt = DateTime.UtcNow;
        var activeSessions = await _context.Sessions.Where(s => s.UserId == user.Id && s.RevokedAt == null).ToListAsync();
        foreach (var session in activeSessions) session.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        await LogAuditAsync(user.Id.ToString(), AuditAction.PASSWORD_RESET, user.Role.ToString(), "");
    }

    public async Task<UserResponse> SignUpAsync(SignUpRequest request, string adminUserId)
    {
        var admin = await _context.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(adminUserId));
        if (admin == null || admin.Role != UserRole.ROLE_ADMIN) throw new UnauthorizedAccessException("Only admin can create new users");
        if (await _context.Users.AnyAsync(u => u.Username == request.Username)) throw new InvalidOperationException("Username already exists");
        if (await _context.Users.AnyAsync(u => u.Email == request.Email)) throw new InvalidOperationException("Email already exists");
        if (!Enum.TryParse<UserRole>(request.Role, true, out var userRole)) throw new InvalidOperationException("Invalid role specified");
        var newUser = new User { Id = Guid.NewGuid(), Username = request.Username, Email = request.Email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12), Role = userRole, IsActive = true, FailedAttempts = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        await LogAuditAsync(adminUserId, AuditAction.SIGNUP, admin.Role.ToString(), "");
        return UserResponse.FromUser(newUser);
    }

    public async Task<User?> ValidateUserAsync(string username, string password, string ipAddress)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash)) return null;
        return user;
    }

    public async Task LogAuditAsync(string? userId, AuditAction action, string? role, string ipAddress)
    {
        _context.AuditLogs.Add(new AuditLog { Id = Guid.NewGuid(), UserId = string.IsNullOrEmpty(userId) ? null : Guid.Parse(userId), Action = action, RoleUsed = role, IpAddress = ipAddress, Timestamp = DateTime.UtcNow });
        await _context.SaveChangesAsync();
    }

    private string GenerateJwtToken(User user)
    {
        var secretKey = _configuration["JwtSettings:SecretKey"]!;
        var issuer = _configuration["JwtSettings:Issuer"];
        var expiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var token = new JwtSecurityToken(issuer: issuer, audience: null, claims: new[] { new System.Security.Claims.Claim("sub", user.Id.ToString()), new System.Security.Claims.Claim("username", user.Username), new System.Security.Claims.Claim("role", user.Role.ToString()), new System.Security.Claims.Claim("email", user.Email) }, expires: DateTime.UtcNow.AddMinutes(expiryMinutes), signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRandomToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private string HashToken(string token)
    {
        using var sha256 = SHA256.Create();
        return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(token)));
    }
}
