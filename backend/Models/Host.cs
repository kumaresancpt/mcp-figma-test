namespace backend.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("hosts")]
public class Host
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [StringLength(255)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("department")]
    public string? Department { get; set; }

    [StringLength(255)]
    [Column("email")]
    public string? Email { get; set; }

    [Column("user_id")]
    public Guid? UserId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Visitor> Visitors { get; set; } = new List<Visitor>();
}
