namespace backend.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Login endpoint - authenticates user and returns JWT token
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { detail = "Invalid request" });
            }

            var ipAddress = GetClientIpAddress();
            var response = await _authService.LoginAsync(request, ipAddress);

            // Set secure, httpOnly cookies
            Response.Cookies.Append("accessToken", response.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(60)
            });

            if (!string.IsNullOrEmpty(response.RefreshToken))
            {
                Response.Cookies.Append("refreshToken", response.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
            }

            _logger.LogInformation("User {Username} logged in successfully", request.Username);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex) when (ex.Message.Contains("Invalid username or password"))
        {
            _logger.LogWarning("Login failed - invalid credentials for user: {Username}", request.Username);
            return StatusCode(401, new { detail = "Invalid username or password" });
        }
        catch (UnauthorizedAccessException ex) when (ex.Message.Contains("Role mismatch"))
        {
            _logger.LogWarning("Login failed - role mismatch for user: {Username}", request.Username);
            return StatusCode(403, new { detail = "Role mismatch" });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Account locked"))
        {
            _logger.LogWarning("Login failed - account locked for user: {Username}", request.Username);
            return StatusCode(423, new { detail = "Account locked due to too many failed attempts. Try again later." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login for user: {Username}", request.Username);
            return StatusCode(500, new { detail = "Internal server error" });
        }
    }

    /// <summary>
    /// Logout endpoint - invalidates user session
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { detail = "Invalid token" });
            }

            await _authService.LogoutAsync(userId);

            // Clear cookies
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

            _logger.LogInformation("User {UserId} logged out", userId);
            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { detail = "Internal server error" });
        }
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { detail = "Invalid token" });
            }

            var user = await _authService.GetCurrentUserAsync(userId);
            return Ok(user);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("User not found: {Exception}", ex.Message);
            return NotFound(new { detail = "User not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, new { detail = "Internal server error" });
        }
    }

    /// <summary>
    /// Request password reset - sends reset token email
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            if (!ModelState.IsValid || !request.IsValid)
            {
                return BadRequest(new { detail = "Username or email is required" });
            }

            var usernameOrEmail = request.Username ?? request.Email ?? "";
            await _authService.ForgotPasswordAsync(usernameOrEmail);

            // Always return success to prevent user enumeration
            _logger.LogInformation("Password reset requested for: {UsernameOrEmail}", usernameOrEmail);
            return Ok(new { message = "If an account with that identifier exists, a password reset email has been sent" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password");
            return StatusCode(500, new { detail = "Internal server error" });
        }
    }

    /// <summary>
    /// Reset password using reset token
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { detail = "Invalid request" });
            }

            await _authService.ResetPasswordAsync(request);

            _logger.LogInformation("Password reset successful");
            return Ok(new { message = "Password reset successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Invalid reset token: {Exception}", ex.Message);
            return Unauthorized(new { detail = "Invalid or expired reset token" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, new { detail = "Internal server error" });
        }
    }

    /// <summary>
    /// Create new user - admin only
    /// </summary>
    [HttpPost("signup")]
    [Authorize(Roles = "ROLE_ADMIN")]
    public async Task<ActionResult<UserResponse>> SignUp([FromBody] SignUpRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { detail = "Invalid request" });
            }

            var adminUserId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(adminUserId))
            {
                return StatusCode(403, new { detail = "Only admin can create new users" });
            }

            var newUser = await _authService.SignUpAsync(request, adminUserId);

            _logger.LogInformation("New user created: {Username}", request.Username);
            return CreatedAtAction(nameof(GetCurrentUser), new { id = newUser.Id }, newUser);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthorized signup attempt: {Exception}", ex.Message);
            return StatusCode(403, new { detail = "Only admin can create new users" });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
        {
            _logger.LogWarning("Duplicate user signup attempt: {Exception}", ex.Message);
            return Conflict(new { detail = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during signup");
            return StatusCode(500, new { detail = "Internal server error" });
        }
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    [HttpGet("health")]
    public ActionResult Health()
    {
        return Ok(new { status = "ok", timestamp = DateTime.UtcNow });
    }

    private string GetClientIpAddress()
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            ipAddress = forwardedFor.ToString().Split(',')[0];
        }

        return ipAddress;
    }
}
