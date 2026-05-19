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
        _logger.LogInformation("Login attempt for user: {Username} from IP: {IpAddress}", request.Username, ipAddress);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null)
        {
            _logger.LogWarning("Login failed: User not found - {Username}", request.Username);
            await LogAuditAsync(null, AuditAction.FAILED_LOGIN, request.Role, ipAddress);
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        if (user.LockedUntil.HasValue && user.LockedUntil > DateTime.UtcNow)
        {
            _logger.LogWarning("Login failed: Account locked - {Username}", request.Username);
            await LogAuditAsync(user.Id.ToString(), AuditAction.ACCOUNT_LOCKED, request.Role, ipAddress);
            throw new InvalidOperationException("Account locked due to too many failed attempts. Try again later.");
        }

        if (!user.IsActive)
        {
            _logger.LogWarning("Login failed: Account inactive - {Username}", request.Username);
            await LogAuditAsync(user.Id.ToString(), AuditAction.FAILED_LOGIN, request.Role, ipAddress);
            throw new UnauthorizedAccessException("Account is inactive");
        }

        if (!user.Role.ToString().Equals(request.Role, StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Login failed: Role mismatch - {Username}, Expected: {ExpectedRole}, Got: {ProvidedRole}", 
                request.Username, user.Role, request.Role);
            await LogAuditAsync(user.Id.ToString(), AuditAction.FAILED_LOGIN, request.Role, ipAddress);
            throw new UnauthorizedAccessException("Role mismatch");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed: Invalid password - {Username}", request.Username);
            
            user.FailedAttempts++;
            if (user.FailedAttempts >= 5)
            {
                user.LockedUntil = DateTime.UtcNow.AddMinutes(15);
                _logger.LogWarning("Account locked after 5 failed attempts - {Username}", request.Username);
            }
            
            await _context.SaveChangesAsync();
            await LogAuditAsync(user.Id.ToString(), AuditAction.FAILED_LOGIN, request.Role, ipAddress);
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        user.FailedAttempts = 0;
        user.LockedUntil = null;
        user.UpdatedAt = DateTime.UtcNow;

        var accessToken = GenerateJwtToken(user);
        var tokenHash = HashToken(accessToken);

        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = tokenHash,
            IsPersistent = request.KeepLoggedIn,
            ExpiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60")),
            IpAddress = ipAddress
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        await LogAuditAsync(user.Id.ToString(), AuditAction.LOGIN, user.Role.ToString(), ipAddress);

        _logger.LogInformation("User logged in successfully: {Username}", request.Username);

        return new LoginResponse
        {
            AccessToken = accessToken,
            TokenType = "Bearer",
            ExpiresIn = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60") * 60,
            RefreshToken = request.KeepLoggedIn ? GenerateRefreshToken() : null
        };
    }

    public async Task LogoutAsync(string userId)
    {
        _logger.LogInformation("Logout request for user: {UserId}", userId);

        var sessions = await _context.Sessions
            .Where(s => s.UserId == Guid.Parse(userId) && s.RevokedAt == null)
            .ToListAsync();

        foreach (var session in sessions)
        {
            session.RevokedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        await LogAuditAsync(userId, AuditAction.LOGOUT, null, "");

        _logger.LogInformation("User logged out: {UserId}", userId);
    }

    public async Task<UserResponse> GetCurrentUserAsync(string userId)
    {
        _logger.LogInformation("Getting current user: {UserId}", userId);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return UserResponse.FromUser(user);
    }

    public async Task ForgotPasswordAsync(string usernameOrEmail)
    {
        _logger.LogInformation("Forgot password request for: {UsernameOrEmail}", usernameOrEmail);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail);

        if (user != null)
        {
            var resetToken = GenerateRandomToken();
            var tokenHash = HashToken(resetToken);

            var passwordResetToken = new PasswordResetToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };

            _context.PasswordResetTokens.Add(passwordResetToken);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Password reset token generated for user: {UserId}", user.Id);
            _logger.LogInformation("Reset token (demo): {ResetToken}", resetToken);
        }
        else
        {
            _logger.LogInformation("Password reset requested for non-existent user: {UsernameOrEmail}", usernameOrEmail);
        }
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        _logger.LogInformation("Password reset request");

        var tokenHash = HashToken(request.ResetToken);
        var resetToken = await _context.PasswordResetTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

        if (resetToken == null || resetToken.ExpiresAt < DateTime.UtcNow || resetToken.UsedAt.HasValue)
        {
            _logger.LogWarning("Invalid or expired reset token");
            throw new UnauthorizedAccessException("Invalid or expired reset token");
        }

        var user = resetToken.User;
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);
        user.PasswordHash = newPasswordHash;
        user.UpdatedAt = DateTime.UtcNow;

        resetToken.UsedAt = DateTime.UtcNow;

        var activeSessions = await _context.Sessions
            .Where(s => s.UserId == user.Id && s.RevokedAt == null)
            .ToListAsync();

        foreach (var session in activeSessions)
        {
            session.RevokedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        await LogAuditAsync(user.Id.ToString(), AuditAction.PASSWORD_RESET, user.Role.ToString(), "");

        _logger.LogInformation("Password reset successful for user: {UserId}", user.Id);
    }

    public async Task<UserResponse> SignUpAsync(SignUpRequest request, string adminUserId)
    {
        _logger.LogInformation("Signup request for user: {Username}", request.Username);

        var admin = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == Guid.Parse(adminUserId));

        if (admin == null || admin.Role != UserRole.ROLE_ADMIN)
        {
            _logger.LogWarning("Signup attempted by non-admin user: {AdminUserId}", adminUserId);
            throw new UnauthorizedAccessException("Only admin can create new users");
        }

        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            _logger.LogWarning("Signup failed: Username already exists - {Username}", request.Username);
            throw new InvalidOperationException("Username already exists");
        }

        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            _logger.LogWarning("Signup failed: Email already exists - {Email}", request.Email);
            throw new InvalidOperationException("Email already exists");
        }

        if (!Enum.TryParse<UserRole>(request.Role, true, out var userRole))
        {
            throw new InvalidOperationException("Invalid role specified");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);

        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = userRole,
            IsActive = true,
            FailedAttempts = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        await LogAuditAsync(adminUserId, AuditAction.SIGNUP, admin.Role.ToString(), "");

        _logger.LogInformation("New user created: {UserId}", newUser.Id);

        return UserResponse.FromUser(newUser);
    }

    public async Task<User?> ValidateUserAsync(string username, string password, string ipAddress)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return null;

        return user;
    }

    public async Task LogAuditAsync(string? userId, AuditAction action, string? role, string ipAddress)
    {
        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),
            UserId = string.IsNullOrEmpty(userId) ? null : Guid.Parse(userId),
            Action = action,
            RoleUsed = role,
            IpAddress = ipAddress,
            Timestamp = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Audit log created: {Action} for user: {UserId}", action, userId);
    }

    private string GenerateJwtToken(User user)
    {
        var secretKey = _configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JWT secret key not configured");
        var issuer = _configuration["JwtSettings:Issuer"] ?? throw new InvalidOperationException("JWT issuer not configured");
        var expiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryMinutes"] ?? "60");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: null,
            claims: new[]
            {
                new System.Security.Claims.Claim("sub", user.Id.ToString()),
                new System.Security.Claims.Claim("username", user.Username),
                new System.Security.Claims.Claim("role", user.Role.ToString()),
                new System.Security.Claims.Claim("email", user.Email)
            },
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRandomToken()
    {
        var randomBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes);
    }

    private string GenerateRefreshToken()
    {
        return GenerateRandomToken();
    }

    private string HashToken(string token)
    {
        using (var sha256 = System.Security.Cryptography.SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}