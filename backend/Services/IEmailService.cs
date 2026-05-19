namespace backend.Services;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string name);
}
