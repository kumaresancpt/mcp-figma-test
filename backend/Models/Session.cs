namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("sessions")]
public class Session
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [Column("user_id")]
    public Guid UserId { get; set; }

    [Required]
    [Column("token_hash")]
    public string TokenHash { get; set; } = string.Empty;

    [Column("is_persistent")]
    public bool IsPersistent { get; set; } = false;

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("ip_address")]
    public string? IpAddress { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("revoked_at")]
    public DateTime? RevokedAt { get; set; }

    // Navigation property
    [ForeignKey("UserId")]
    public User? User { get; set; }
}
