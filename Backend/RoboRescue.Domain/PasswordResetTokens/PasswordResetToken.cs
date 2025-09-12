using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Users;

namespace RoboRescue.Domain.PasswordResetTokens;

public class PasswordResetToken : BaseEntity
{
    public PasswordResetToken(Guid id, Guid userId, string passwordToken, DateTimeOffset expiredAt) :
        base(id)
    {
        UserId = userId;
        PasswordToken = passwordToken;
        ExpiredAt = expiredAt;
        IsUsed = false;
        User = null!;
    }

    public Guid UserId { get; private set; }
    public string PasswordToken { get; private set; }
    public DateTimeOffset ExpiredAt { get; private set; }
    public bool IsUsed { get; private set; }
    public virtual User User { get; private set; }

    public static PasswordResetToken Create(Guid userId, string passwordToken, DateTimeOffset expiredAt)
    {
        return new PasswordResetToken(Guid.NewGuid(), userId, passwordToken, expiredAt);
    }

    public void SetAsUsed()
    {
        IsUsed = true;
    }
}