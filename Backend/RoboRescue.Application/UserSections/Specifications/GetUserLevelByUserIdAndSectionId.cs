using Ardalis.Specification;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.UserSections.Specifications;

internal sealed class GetUserLevelByUserIdAndSectionId : Specification<UserLevel>
{
    public GetUserLevelByUserIdAndSectionId(Guid sectionId, Guid userId)
    {
        Query.Include(u => u.Level).Where(u => u.UserId == userId && u.Level.SectionId == sectionId);
    }
}