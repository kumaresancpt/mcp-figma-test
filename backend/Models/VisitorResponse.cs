namespace backend.Models;

using System.Text.Json.Serialization;

public class VisitorResponse
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("company")]
    public string? Company { get; set; }

    [JsonPropertyName("host")]
    public string? Host { get; set; }

    [JsonPropertyName("purpose")]
    public string Purpose { get; set; } = string.Empty;

    [JsonPropertyName("check_in_time")]
    public DateTime? CheckInTime { get; set; }

    [JsonPropertyName("check_out_time")]
    public DateTime? CheckOutTime { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("badge")]
    public string? Badge { get; set; }

    [JsonPropertyName("scheduled_time")]
    public DateTime? ScheduledTime { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    public static VisitorResponse FromVisitor(Visitor visitor)
    {
        return new VisitorResponse
        {
            Id = visitor.Id,
            Name = visitor.Name,
            Company = visitor.Company,
            Host = visitor.Host?.Name,
            Purpose = visitor.Purpose,
            CheckInTime = visitor.CheckInTime,
            CheckOutTime = visitor.CheckOutTime,
            Status = visitor.Status.ToString(),
            Badge = visitor.Badge?.BadgeType.ToString(),
            ScheduledTime = visitor.ScheduledTime,
            CreatedAt = visitor.CreatedAt
        };
    }
}

public class PaginatedVisitorResponse
{
    [JsonPropertyName("items")]
    public List<VisitorResponse> Items { get; set; } = new();

    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("limit")]
    public int Limit { get; set; }
}
