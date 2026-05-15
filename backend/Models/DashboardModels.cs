namespace backend.Models;

using System.Text.Json.Serialization;

public class DashboardStatsResponse
{
    [JsonPropertyName("visitors_today")]
    public int VisitorsToday { get; set; }

    [JsonPropertyName("active_visitors")]
    public int ActiveVisitors { get; set; }

    [JsonPropertyName("pending_approvals")]
    public int PendingApprovals { get; set; }

    [JsonPropertyName("overstay_alerts")]
    public int OverstayAlerts { get; set; }
}

public class TrendItem
{
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("count")]
    public int Count { get; set; }
}

public class PurposeItem
{
    [JsonPropertyName("purpose")]
    public string Purpose { get; set; } = string.Empty;

    [JsonPropertyName("count")]
    public int Count { get; set; }
}
