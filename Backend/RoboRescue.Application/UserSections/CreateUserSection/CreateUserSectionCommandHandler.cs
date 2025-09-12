using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.UserSections.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.UserSections.CreateUserSection;

internal class CreateUserSectionCommandHandler(
    IRepository<UserLevel> repository,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateUserSectionCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateUserSectionCommand request, CancellationToken cancellationToken)
    {
        var domainUserSection =
            await repository.FirstOrDefaultAsync(new GetUserLevelByUserIdAndLevelId(request.UserId, request.LevelId),
                cancellationToken);
        if (domainUserSection is not null)
        {
            return Result.Failure<Guid>(Error.LevelPassedBefore);
        }

        var userSection = UserLevel.Create(request.UserId, request.LevelId, request.Code);
        await repository.Add(userSection, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(userSection.Id);
    }
}