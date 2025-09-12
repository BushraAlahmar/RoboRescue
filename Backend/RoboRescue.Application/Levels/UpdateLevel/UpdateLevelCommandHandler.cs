using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.UpdateLevel;

internal class UpdateLevelCommandHandler(
    IRepository<Level> repository,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateLevelCommand, bool>
{
    public async Task<Result<bool>> Handle(UpdateLevelCommand request, CancellationToken cancellationToken)
    {
        var level = await repository.FirstOrDefaultAsync(new GetLevelById(request.LevelId), cancellationToken);
        if (level is null)
        {
            return Result.Failure<bool>(Error.IncorrectCredentials);
        }

        level.Update(request.Name, request.EnName, request.LevelNumber, request.SectionId,
            request.CodeAnalyzerId,
            request.Description,
            request.EnDescription,
            request.Task, request.EnTask, request.SuccessMessage, request.EnSuccessMessage, request.DependentOnLevelId);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}