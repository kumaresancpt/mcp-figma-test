namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class ResetPasswordRequest
{
    [Required(ErrorMessage = "Reset token is required")]
    [JsonPropertyName("resetToken")]
    public string ResetToken { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required")]
    [StringLength(255, MinimumLength = 8)]
    [JsonPropertyName("newPassword")]
    public string NewPassword { get; set; } = string.Empty;
}
