namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class SignUpRequest
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(255, MinimumLength = 3)]
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(255)]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(255, MinimumLength = 8)]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required")]
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;
}
