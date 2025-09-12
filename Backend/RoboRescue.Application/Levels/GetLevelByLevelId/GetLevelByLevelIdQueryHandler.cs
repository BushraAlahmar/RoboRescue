using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Dtos;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.GetLevelByLevelId;

internal class GetLevelByLevelIdQueryHandler(IRepository<Level> repository)
    : IQueryHandler<GetLevelByLevelIdQuery, LevelResponse>
{
    public async Task<Result<LevelResponse>> Handle(GetLevelByLevelIdQuery request, CancellationToken cancellationToken)
    {
        var level = await repository.GetWithRelated(new GetLevelById(request.LevelId), cancellationToken,
            l => l.Section);
        if (level is null) return Result.Failure<LevelResponse>(Error.IncorrectCredentials);
        var levelResponse = new LevelResponse
        {
            Id = level.Id,
            CodeAnalyzerId = level.CodeAnalyzerId,
            LevelNumber = level.LevelNumber,
            SectionId = level.SectionId,
            Description = request.Lang.Trim().ToLower().Equals("de") ? level.Description : level.EnDescription,
            SuccessMessage = request.Lang.Trim().ToLower().Equals("de") ? level.SuccessMessage : level.EnSuccessMessage,
            Name = request.Lang.Trim().ToLower().Equals("de") ? level.Name : level.EnName,
            Task = request.Lang.Trim().ToLower().Equals("de") ? level.Task : level.EnTask,
            UpdatedAt = level.UpdatedAt,
            DeletedAt = level.DeletedAt,
            DependentOnLevelId = level.DependentOnLevelId,
            SectionSectionNumber = level.Section.SectionNumber
        };
        return Result.Success(levelResponse);
    }
}