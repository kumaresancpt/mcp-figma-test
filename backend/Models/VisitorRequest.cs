namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class CreateVisitorRequest
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(255)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    [JsonPropertyName("company")]
    public string? Company { get; set; }

    [JsonPropertyName("host_id")]
    public Guid? HostId { get; set; }

    [Required(ErrorMessage = "Purpose is required")]
    [JsonPropertyName("purpose")]
    public string Purpose { get; set; } = string.Empty;

    [JsonPropertyName("scheduled_time")]
    public DateTime? ScheduledTime { get; set; }
}

public class UpdateVisitorRequest
{
    [StringLength(255)]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [StringLength(255)]
    [JsonPropertyName("company")]
    public string? Company { get; set; }

    [JsonPropertyName("host_id")]
    public Guid? HostId { get; set; }

    [JsonPropertyName("purpose")]
    public string? Purpose { get; set; }

    [JsonPropertyName("scheduled_time")]
    public DateTime? ScheduledTime { get; set; }
}
