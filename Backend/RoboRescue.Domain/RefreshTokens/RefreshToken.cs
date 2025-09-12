using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Users;

namespace RoboRescue.Domain.RefreshTokens;

public sealed class RefreshToken : BaseEntity
{
    private RefreshToken(
        Guid id,
        string token,
        DateTimeOffset expired,
        string userSecurityHash,
        Guid userId) : base(id)
    {
        Token = token;
        Expired = expired;
        UserSecurityHash = userSecurityHash;
        UserId = userId;
        User = null!;
    }
    public string Token { get; private set; }
    public DateTimeOffset Expired { get; private set; }
    public string UserSecurityHash { get; private set; }
    public bool IsUsed { get; private set; }
    public Guid UserId { get; private set; }
    public User User { get; set; }

    public static RefreshToken Create(
        string token,
        DateTimeOffset expired,
        string userSecurityHash,
        Guid userId)
    {
        return new RefreshToken(Guid.NewGuid(), token, expired, userSecurityHash, userId);
    }

    public void ExpireToken()
    {
        IsUsed = true;
    }

    public static string CreateRefreshToken()
    {
        return Guid.NewGuid() + Guid.NewGuid().ToString() + Guid.NewGuid();
    }
}