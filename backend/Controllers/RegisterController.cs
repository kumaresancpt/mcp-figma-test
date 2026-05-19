namespace backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

[ApiController]
[Route("api/v1/auth")]
public class RegisterController : ControllerBase
{
    private readonly IRegisterService _registerService;

    public RegisterController(IRegisterService registerService)
    {
        _registerService = registerService;
    }

    /// <summary>
    /// Public visitor registration — POST /api/v1/auth/register
    /// Accepts name, email, phoneNumber, password, confirmPassword.
    /// Returns 201 on success; 400 with { detail, field } on validation failure.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // AC22: ModelState validation for missing required fields
        if (!ModelState.IsValid)
        {
            var firstError = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .First();
            return BadRequest(new { detail = firstError });
        }

        var (success, error, field) = await _registerService.RegisterAsync(request);

        if (!success)
            return BadRequest(new { detail = error, field });

        // AC20: Return 201 Created — no passwordHash in response
        return StatusCode(201, new RegisterResponse { Message = "Account created successfully" });
    }
}
