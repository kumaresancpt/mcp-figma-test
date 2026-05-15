namespace backend.Data;

using Microsoft.EntityFrameworkCore;
using backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<Visitor> Visitors { get; set; }
    public DbSet<Badge> Badges { get; set; }
    public DbSet<Host> Hosts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
        modelBuilder.Entity<AuditLog>().Property(a => a.Action).HasConversion<string>();
        modelBuilder.Entity<Visitor>().Property(v => v.Status).HasConversion<string>();
        modelBuilder.Entity<Badge>().Property(b => b.BadgeType).HasConversion<string>();

        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        modelBuilder.Entity<Session>()
            .HasOne(s => s.User)
            .WithMany(u => u.Sessions)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AuditLog>()
            .HasOne(a => a.User)
            .WithMany(u => u.AuditLogs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<PasswordResetToken>()
            .HasOne(p => p.User)
            .WithMany(u => u.PasswordResetTokens)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Visitor>()
            .HasOne(v => v.Host)
            .WithMany(h => h.Visitors)
            .HasForeignKey(v => v.HostId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Badge>()
            .HasOne(b => b.Visitor)
            .WithOne(v => v.Badge)
            .HasForeignKey<Badge>(b => b.VisitorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
