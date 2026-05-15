using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Data;
using backend.Services;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];
var issuer = jwtSettings["Issuer"];

if (string.IsNullOrEmpty(secretKey) || secretKey.Length < 32)
{
    throw new InvalidOperationException("JwtSettings:SecretKey must be at least 32 characters long and configured in appsettings.json");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = "role",
        NameClaimType = "sub"
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("accessToken"))
            {
                context.Token = context.Request.Cookies["accessToken"];
            }
            return Task.CompletedTask;
        }
    };
});

// CORS
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "*" };
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IVisitorService, VisitorService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddLogging();

var app = builder.Build();

// Swagger enabled in ALL environments - unconditional
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }))
    .WithName("Health")
    .WithOpenApi();

// Seed database with demo data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();

    var demoUsers = new[]
    {
        new { Username = "admin",         Email = "admin@example.com",         Password = "Admin@123!",    Role = UserRole.ROLE_ADMIN },
        new { Username = "receptionist",  Email = "recep@example.com",         Password = "Recep@123!",    Role = UserRole.ROLE_RECEPTIONIST },
        new { Username = "security",      Email = "security@example.com",      Password = "Security@123!", Role = UserRole.ROLE_SECURITY_GUARD },
    };

    foreach (var demo in demoUsers)
    {
        var existing = dbContext.Users.FirstOrDefault(u => u.Username == demo.Username);
        if (existing == null)
        {
            dbContext.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = demo.Username,
                Email = demo.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(demo.Password, 12),
                Role = demo.Role,
                IsActive = true,
                FailedAttempts = 0,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(demo.Password, 12);
            existing.FailedAttempts = 0;
            existing.LockedUntil = null;
        }
    }
    dbContext.SaveChanges();

    // Seed demo hosts
    if (!dbContext.Hosts.Any())
    {
        dbContext.Hosts.AddRange(
            new backend.Models.Host { Id = Guid.NewGuid(), Name = "Arun Kumar", Department = "Engineering", Email = "arun@example.com", CreatedAt = DateTime.UtcNow },
            new backend.Models.Host { Id = Guid.NewGuid(), Name = "Priya Singh", Department = "HR", Email = "priya@example.com", CreatedAt = DateTime.UtcNow },
            new backend.Models.Host { Id = Guid.NewGuid(), Name = "Ravi Shankar", Department = "Finance", Email = "ravi@example.com", CreatedAt = DateTime.UtcNow }
        );
        dbContext.SaveChanges();
    }
}

app.Run();
