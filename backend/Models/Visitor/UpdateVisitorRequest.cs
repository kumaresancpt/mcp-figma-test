using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models.Visitor
{
    public class UpdateVisitorRequest
    {
        [StringLength(255)]
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [StringLength(255)]
        [JsonPropertyName("company")]
        public string? Company { get; set; }

        [StringLength(255)]
        [JsonPropertyName("host")]
        public string? Host { get; set; }

        [StringLength(500)]
        [JsonPropertyName("purpose")]
        public string? Purpose { get; set; }

        [JsonPropertyName("status")]
        public VisitorStatus? Status { get; set; }

        [JsonPropertyName("badge")]
        public BadgeStatus? Badge { get; set; }

        [JsonPropertyName("checkOutTime")]
        public DateTime? CheckOutTime { get; set; }

        [StringLength(1000)]
        [JsonPropertyName("notes")]
        public string? Notes { get; set; }
    }
}