namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class ForgotPasswordRequest
{
    [JsonPropertyName("username")]
    [StringLength(255)]
    public string? Username { get; set; }

    [EmailAddress]
    [StringLength(255)]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    public bool IsValid => !string.IsNullOrWhiteSpace(Username) || !string.IsNullOrWhiteSpace(Email);
}
