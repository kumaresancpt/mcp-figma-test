namespace backend.Services;

using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendVerificationEmailAsync(string email, string name)
    {
        try
        {
            var smtpHost = _configuration["EmailSettings:SmtpHost"] ?? "smtp.example.com";
            var smtpPort = int.TryParse(_configuration["EmailSettings:SmtpPort"], out var port) ? port : 587;
            var fromAddress = _configuration["EmailSettings:FromAddress"] ?? "noreply@example.com";
            var fromName = _configuration["EmailSettings:FromName"] ?? "Visitor App";
            var username = _configuration["EmailSettings:Username"];
            var password = _configuration["EmailSettings:Password"];

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(username, password)
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromAddress, fromName),
                Subject = "Verify your Visitor App account",
                Body = $"Hello {name},\n\nThank you for registering. Please verify your account to get started.\n\nBest regards,\nVisitor App Team",
                IsBodyHtml = false
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Verification email sent to {Email}", email);
        }
        catch (Exception ex)
        {
            // Fire-and-forget: log and swallow so registration always succeeds
            _logger.LogError(ex, "Failed to send verification email to {Email}", email);
        }
    }
}
