using Ardalis.Specification;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.UserSections.Specifications;

internal sealed class GetUserLevelByUserIdAndLevelId : Specification<UserLevel>
{
    public GetUserLevelByUserIdAndLevelId(Guid userId, Guid levelId)
    {
        Query.Where(u => u.UserId == userId && u.LevelId == levelId);
    }
}