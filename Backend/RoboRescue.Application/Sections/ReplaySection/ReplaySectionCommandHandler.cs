using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Application.UserSections.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.Sections.ReplaySection;

public class ReplaySectionCommandHandler(
    IRepository<UserLevel> userRepository,
    IRepository<Level> levelRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<ReplaySectionCommand, bool>
{
    public async Task<Result<bool>> Handle(ReplaySectionCommand request, CancellationToken cancellationToken)
    {
        var userLevels =
            await userRepository.GetSpecifiedList(
                new GetUserLevelByUserIdAndSectionId(request.SectionId, request.UserId), cancellationToken);
        var levels =
            await levelRepository.GetSpecifiedList(new GetLevelBySectionIdAndLevelNumber(request.SectionId, null),
                cancellationToken);
        if (levels.Count != userLevels.Count)
        {
            return Result.Failure<bool>(Error.FinishAllTheSectionToReplay);
        }

        userRepository.DeleteRange(userLevels);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}