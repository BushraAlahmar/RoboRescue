using Microsoft.IdentityModel.Tokens;
using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.JavaCodeAnalyzer;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Application.UserSections.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Levels;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.Analyzers.CheckCode;

public class CheckCodeCommandHandler(
    IJavaCodeAnalyzer javaCodeAnalyzer,
    IRepository<Level> levelRepository,
    IRepository<UserLevel> userLevelRepository,
    IUnitOfWork unitOfWork) : ICommandHandler<CheckCodeCommand, List<string>>
{
    public async Task<Result<List<string>>> Handle(CheckCodeCommand request, CancellationToken cancellationToken)
    {
        var userLevels =
            await userLevelRepository.GetSpecifiedList(
                new GetUserLevelByUserIdAndLevelId(request.UserId, request.LevelId), cancellationToken);
        if (userLevels.Count != 0)
        {
            return Result.Failure<List<string>>(Error.ThisTaskIsSolvedBefore);
        }

        var level = await levelRepository.GetWithRelated(new GetLevelById(request.LevelId), cancellationToken,
            level => level.CodeAnalyzer);
        if (level is null) return Result.Failure<List<string>>(Error.IncorrectCredentials);
        var code = request.Code;
        if (level.DependentOnLevelId is not null)
        {
            var domainUserLevel = await userLevelRepository.FirstOrDefaultAsync(
                new GetUserLevelByUserIdAndLevelId(request.UserId, level.DependentOnLevelId.Value),
                cancellationToken);
            if (domainUserLevel is null) return Result.Failure<List<string>>(Error.IncorrectCredentials);
            code = request.Code + domainUserLevel.Code;
        }

        var analyzedCode = javaCodeAnalyzer.AnalyzeJavaCode(code);
        var result = analyzedCode.CheckCode(level.CodeAnalyzer, request.Lang);
        if (result.Count != 0 || !result.IsNullOrEmpty()) return Result.Success(result);
        var userLevel = UserLevel.Create(request.UserId, request.LevelId, code);
        await userLevelRepository.Add(userLevel, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(result);
    }
}