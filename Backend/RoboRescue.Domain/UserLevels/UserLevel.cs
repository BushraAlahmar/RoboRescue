using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;
using RoboRescue.Domain.Users;

namespace RoboRescue.Domain.UserLevels;

public sealed class UserLevel : BaseEntity
{
    private UserLevel(Guid id, Guid userId, Guid levelId, string code) : base(id)
    {
        UserId = userId;
        User = null!;
        LevelId = levelId;
        Level = null!;
        Code = code;
    }

    public Guid UserId { get; private set; }
    public User User { get; private set; }
    public Guid LevelId { get; private set; }
    public Level Level { get; private set; }
    public string Code { get; private set; }

    public static UserLevel Create(Guid userId, Guid levelId, string code)
    {
        return new UserLevel(Guid.NewGuid(), userId, levelId, code);
    }

    public void Update(Guid userId, Guid levelId, string code)
    {
        UserId = userId;
        LevelId = levelId;
        Code = code;
    }
}