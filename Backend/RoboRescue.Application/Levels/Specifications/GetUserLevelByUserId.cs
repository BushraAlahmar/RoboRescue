using Ardalis.Specification;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.Levels.Specifications;

internal sealed class GetUserLevelByUserId : Specification<UserLevel>
{
    public GetUserLevelByUserId(Guid userId)
    {
        Query.Where(l => l.UserId == userId);
    }
}