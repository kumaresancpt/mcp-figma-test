using System.Text.Json.Serialization;

namespace Backend.Models.Visitor
{
    public class VisitorResponse
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("company")]
        public string Company { get; set; } = string.Empty;

        [JsonPropertyName("host")]
        public string Host { get; set; } = string.Empty;

        [JsonPropertyName("purpose")]
        public string? Purpose { get; set; }

        [JsonPropertyName("checkInTime")]
        public DateTime CheckInTime { get; set; }

        [JsonPropertyName("checkOutTime")]
        public DateTime? CheckOutTime { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = VisitorStatus.CheckIn.ToString();

        [JsonPropertyName("badge")]
        public string Badge { get; set; } = BadgeStatus.NoBadge.ToString();

        [JsonPropertyName("visitorImage")]
        public string? VisitorImage { get; set; }

        [JsonPropertyName("phoneNumber")]
        public string? PhoneNumber { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}