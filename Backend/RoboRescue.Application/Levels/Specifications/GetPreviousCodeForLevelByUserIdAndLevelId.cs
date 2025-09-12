using Ardalis.Specification;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.Levels.Specifications;

internal sealed class GetPreviousCodeForLevelByUserIdAndLevelId : Specification<UserLevel>
{
    public GetPreviousCodeForLevelByUserIdAndLevelId(Guid levelId, Guid userId)
    {
        Query.Where(ul => ul.LevelId == levelId && ul.UserId == userId);
    }
}