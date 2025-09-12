using System.Security.Cryptography;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Users;

namespace RoboRescue.Domain.EmailTokens;

public class EmailToken : BaseEntity
{
    private EmailToken(Guid id, string token, string? email, bool isUsed, DateTimeOffset expiredAt, Guid userId) :
        base(id)
    {
        Token = token;
        Email = email;
        IsUsed = isUsed;
        ExpiredAt = expiredAt;
        UserId = userId;
        User = null!;
    }

    public string Token { get; private set; }
    public string? Email { get; private set; }
    public bool IsUsed { get; private set; }
    public DateTimeOffset ExpiredAt { get; private set; }
    public Guid UserId { get; private set; }
    public User User { get; private set; }

    public static EmailToken Create(string? email, Guid userId)
    {
        return new EmailToken(Guid.NewGuid(), RandomNumberGenerator.GetInt32(1000_0000, 9999_9999).ToString(), email,
            false, DateTimeOffset.UtcNow.AddMinutes(10), userId);
    }

    public void SetAsUsed()
    {
        IsUsed = true;
    }
}