using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.Levels.GetPreviousCodeForLevel;

internal class GetPreviousCodeForLevelQueryHandler(
    IRepository<UserLevel> repository
) : IQueryHandler<GetPreviousCodeForLevelQuery, string>
{
    public async Task<Result<string>> Handle(GetPreviousCodeForLevelQuery request, CancellationToken cancellationToken)
    {
        var userLevel = await repository.FirstOrDefaultAsync(
            new GetPreviousCodeForLevelByUserIdAndLevelId(request.LevelId, request.UserId), cancellationToken);
        return userLevel is null ? Result.Failure<string>(Error.IncorrectCredentials) : Result.Success(userLevel.Code);
    }
}