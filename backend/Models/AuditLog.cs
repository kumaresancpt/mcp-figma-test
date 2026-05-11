namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("audit_logs")]
public class AuditLog
{
    [Key]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid? UserId { get; set; }

    [Required]
    [Column("action")]
    public AuditAction Action { get; set; }

    [Column("role_used")]
    public string? RoleUsed { get; set; }

    [Column("ip_address")]
    public string? IpAddress { get; set; }

    [Column("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("UserId")]
    public User? User { get; set; }
}

public enum AuditAction
{
    LOGIN,
    LOGOUT,
    FAILED_LOGIN,
    ACCOUNT_LOCKED,
    PASSWORD_RESET,
    SIGNUP
}
