using Ardalis.Specification;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.Specifications;

internal sealed class GetLevelById : Specification<Level>
{
    public GetLevelById(Guid levelId)
    {
        Query.Where(l => l.Id == levelId);
    }
}