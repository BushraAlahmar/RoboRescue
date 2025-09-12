using Ardalis.Specification;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.Specifications;

internal sealed class GetLevelBySectionIdAndLevelNumber : Specification<Level>
{
    public GetLevelBySectionIdAndLevelNumber(Guid? sectionId, int? levelNumber)
    {
        Query.Where(l => sectionId == null || l.SectionId == sectionId)
            .Where(l => levelNumber == null || l.LevelNumber == levelNumber);
    }
}