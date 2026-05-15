namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("badges")]
public class Badge
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [Column("visitor_id")]
    public Guid VisitorId { get; set; }

    [Column("badge_type")]
    public BadgeType BadgeType { get; set; } = BadgeType.pending;

    [Column("qr_code_data")]
    public string? QrCodeData { get; set; }

    [Column("printed_at")]
    public DateTime? PrintedAt { get; set; }

    [Column("generated_at")]
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("VisitorId")]
    public Visitor? Visitor { get; set; }
}

public enum BadgeType
{
    qr_generated,
    badge_printed,
    pending
}
