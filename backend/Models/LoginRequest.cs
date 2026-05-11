namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class LoginRequest
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(255, MinimumLength = 1)]
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(255, MinimumLength = 1)]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required")]
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;

    [JsonPropertyName("keepLoggedIn")]
    public bool KeepLoggedIn { get; set; } = false;
}
