namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("visitors")]
public class Visitor
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [StringLength(255)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("company")]
    public string? Company { get; set; }

    [Column("host_id")]
    public Guid? HostId { get; set; }

    [StringLength(100)]
    [Column("purpose")]
    public string Purpose { get; set; } = string.Empty;

    [Column("scheduled_time")]
    public DateTime? ScheduledTime { get; set; }

    [Column("check_in_time")]
    public DateTime? CheckInTime { get; set; }

    [Column("check_out_time")]
    public DateTime? CheckOutTime { get; set; }

    [Required]
    [Column("status")]
    public VisitorStatus Status { get; set; } = VisitorStatus.waiting;

    [Column("created_by")]
    public Guid? CreatedBy { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("HostId")]
    public Host? Host { get; set; }

    public Badge? Badge { get; set; }
}

public enum VisitorStatus
{
    waiting,
    checked_in,
    checked_out,
    pending_approval,
    expired_pass
}
