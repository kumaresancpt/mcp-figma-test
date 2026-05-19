namespace backend.Services;

using System.Text.RegularExpressions;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class RegisterService : IRegisterService
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly ILogger<RegisterService> _logger;

    // AC17: Phone number validation regex
    private static readonly Regex PhoneRegex =
        new(@"^\+?[\d\s\-()]{7,15}$", RegexOptions.Compiled);

    public RegisterService(AppDbContext db, IEmailService emailService, ILogger<RegisterService> logger)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<(bool Success, string? Error, string? Field)> RegisterAsync(RegisterRequest request)
    {
        // AC15: Validate password == confirmPassword
        if (request.Password != request.ConfirmPassword)
            return (false, "Passwords do not match", null);

        // AC16: Validate password length >= 8 (also enforced by [MinLength] attribute)
        if (request.Password.Length < 8)
            return (false, "Password must be at least 8 characters", "password");

        // AC17: Validate phone number format
        if (string.IsNullOrWhiteSpace(request.PhoneNumber) || !PhoneRegex.IsMatch(request.PhoneNumber))
            return (false, "Invalid phone number format", "phoneNumber");

        // AC14: Check email uniqueness
        var emailExists = await _db.Users.AnyAsync(u => u.Email == request.Email);
        if (emailExists)
            return (false, "Email already registered", "email");

        // AC18: Hash password with BCrypt — NEVER store plain text
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);

        // AC19: Create User entity
        // NOTE: Name, PhoneNumber, and IsVerified columns require a DB migration.
        //       The database agent (07-database-writer) is responsible for adding these
        //       properties to User.cs and running the migration.
        //       Username is set to email for compatibility with the existing auth system.
        //       Role uses ROLE_RECEPTIONIST as placeholder — database agent should add
        //       UserRole.ROLE_VISITOR to the enum.
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Email,
            Name = request.Name,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = passwordHash,
            Role = UserRole.ROLE_VISITOR,
            IsActive = true,
            IsVerified = false,
            FailedAttempts = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        _logger.LogInformation("New visitor registered: {Email}", request.Email);

        // AC21: Fire-and-forget verification email — never blocks the response
        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendVerificationEmailAsync(request.Email, request.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Background email task failed for {Email}", request.Email);
            }
        });

        return (true, null, null);
    }
}
