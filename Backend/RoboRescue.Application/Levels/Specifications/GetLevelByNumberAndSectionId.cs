using Ardalis.Specification;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.Specifications;

internal sealed class GetLevelByNumberAndSectionId : Specification<Level>
{
    public GetLevelByNumberAndSectionId(int levelNumber, Guid sectionId)
    {
        Query.Where(l => l.LevelNumber == levelNumber && l.SectionId == sectionId);
    }
}