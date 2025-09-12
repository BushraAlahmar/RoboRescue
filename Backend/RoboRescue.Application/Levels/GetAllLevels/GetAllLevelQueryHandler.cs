using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Dtos;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.GetAllLevels;

public class GetAllLevelQueryHandler(IRepository<Level> repository)
    : IQueryHandler<GetAllLevelsQuery, PaginatedList<LevelResponse>>
{
    public async Task<Result<PaginatedList<LevelResponse>>> Handle(GetAllLevelsQuery request,
        CancellationToken cancellationToken)
    {
        request.Spec(new GetLevelBySectionIdAndLevelNumber(request.SectionId, request.LevelNumber));
        var levels = await repository.GetSpecifiedPaginatedList(request, cancellationToken);
        return levels;
    }
}