using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.CreateLevel;

internal class CreateLevelCommandHandler(
    IRepository<Level> repository,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateLevelCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateLevelCommand request, CancellationToken cancellationToken)
    {
        var domainLevel =
            await repository.FirstOrDefaultAsync(
                new GetLevelByNumberAndSectionId(request.LevelNumber, request.SectionId), cancellationToken);
        if (domainLevel is not null)
        {
            return Result.Failure<Guid>(Error.LevelNumberIsExist);
        }

        var level = Level.Create(request.Name, request.EnName, request.LevelNumber, request.SectionId,
            request.CodeAnalyzerId,
            request.Description,
            request.EnDescription,
            request.Task, request.EnTask, request.SuccessMessage, request.EnSuccessMessage, request.DependentOnLevelId);
        await repository.Add(level, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(level.Id);
    }
}