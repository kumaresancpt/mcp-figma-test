using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Visitor
{
    [Table("visitors")]
    public class Visitor
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column("name")]
        [Required(ErrorMessage = "Name is required")]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Column("company")]
        [Required(ErrorMessage = "Company is required")]
        [StringLength(255)]
        public string Company { get; set; } = string.Empty;

        [Column("host")]
        [Required(ErrorMessage = "Host is required")]
        [StringLength(255)]
        public string Host { get; set; } = string.Empty;

        [Column("purpose")]
        [StringLength(500)]
        public string? Purpose { get; set; }

        [Column("check_in_time")]
        [Required(ErrorMessage = "Check-in time is required")]
        public DateTime CheckInTime { get; set; }

        [Column("check_out_time")]
        public DateTime? CheckOutTime { get; set; }

        [Column("status")]
        public VisitorStatus Status { get; set; } = VisitorStatus.CheckIn;

        [Column("badge")]
        public BadgeStatus Badge { get; set; } = BadgeStatus.NoBadge;

        [Column("visitor_image")]
        [StringLength(500)]
        public string? VisitorImage { get; set; }

        [Column("phone_number")]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [Column("email")]
        [StringLength(255)]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }

        [Column("notes")]
        [StringLength(1000)]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}