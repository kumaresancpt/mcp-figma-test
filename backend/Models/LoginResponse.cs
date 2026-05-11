namespace backend.Models;

using System.Text.Json.Serialization;

public class LoginResponse
{
    [JsonPropertyName("accessToken")]
    public string AccessToken { get; set; } = string.Empty;

    [JsonPropertyName("tokenType")]
    public string TokenType { get; set; } = "Bearer";

    [JsonPropertyName("expiresIn")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("refreshToken")]
    public string? RefreshToken { get; set; }
}
