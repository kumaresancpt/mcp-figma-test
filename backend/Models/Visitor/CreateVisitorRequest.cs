using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models.Visitor
{
    public class CreateVisitorRequest
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(255)]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Company is required")]
        [StringLength(255)]
        [JsonPropertyName("company")]
        public string Company { get; set; } = string.Empty;

        [Required(ErrorMessage = "Host is required")]
        [StringLength(255)]
        [JsonPropertyName("host")]
        public string Host { get; set; } = string.Empty;

        [StringLength(500)]
        [JsonPropertyName("purpose")]
        public string? Purpose { get; set; }

        [Required(ErrorMessage = "Check-in time is required")]
        [JsonPropertyName("checkInTime")]
        public DateTime CheckInTime { get; set; }

        [StringLength(500)]
        [JsonPropertyName("visitorImage")]
        public string? VisitorImage { get; set; }

        [StringLength(20)]
        [JsonPropertyName("phoneNumber")]
        public string? PhoneNumber { get; set; }

        [StringLength(255)]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [StringLength(1000)]
        [JsonPropertyName("notes")]
        public string? Notes { get; set; }
    }
}