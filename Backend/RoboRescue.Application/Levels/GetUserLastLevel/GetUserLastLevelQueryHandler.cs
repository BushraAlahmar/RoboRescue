using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Specifications;
using RoboRescue.Application.Levels.Dtos;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.UserLevels;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Levels.GetUserLastLevel;

public class GetUserLastLevelQueryHandler(
    IRepository<User> userRepository,
    IRepository<UserLevel> userLevelRepository) : IQueryHandler<GetUserLastLevelQuery, List<LevelResponse>>
{
    public async Task<Result<List<LevelResponse>>> Handle(GetUserLastLevelQuery request,
        CancellationToken cancellationToken)
    {
        var user = await userRepository.FirstOrDefaultAsync(new GetUserById(request.UserId), cancellationToken);
        if (user is null)
        {
            return Result.Failure<List<LevelResponse>>(Error.IncorrectCredentials);
        }

        var userLevels = await userLevelRepository.GetAllWithRelated(new GetUserLevelByUserId(request.UserId),
            cancellationToken, l => l.Level, l => l.Level.Section);
        if (userLevels is null || userLevels.Count == 0) return Result.Success(new List<LevelResponse>());
        var userLastLevel = userLevels
            .GroupBy(l => l.Level.SectionId)
            .Select(g => g.OrderByDescending(ul => ul.Level.LevelNumber).First())
            .ToList();
        var listOfLevels = new List<LevelResponse>();
        foreach (var levelResponse in userLastLevel)
        {
            listOfLevels.Add(new LevelResponse
            {
                LevelNumber = levelResponse.Level.LevelNumber,
                SectionId = levelResponse.Level.SectionId,
                CodeAnalyzerId = levelResponse.Level.CodeAnalyzerId,
                Id = levelResponse.Id,
                Description = request.Lang.Trim().ToLower().Equals("de") ? levelResponse.Level.Description : levelResponse.Level.EnDescription,
                SuccessMessage = request.Lang.Trim().ToLower().Equals("de") ? levelResponse.Level.SuccessMessage :  levelResponse.Level.EnSuccessMessage,
                Name = request.Lang.Trim().ToLower().Equals("de") ? levelResponse.Level.Name :  levelResponse.Level.EnName,
                UpdatedAt = levelResponse.Level.UpdatedAt,
                DeletedAt = levelResponse.Level.DeletedAt,
                Task = request.Lang.Trim().ToLower().Equals("de") ? levelResponse.Level.Task :  levelResponse.Level.EnTask,
                DependentOnLevelId = levelResponse.Level.DependentOnLevelId,
                SectionSectionNumber = levelResponse.Level.Section.SectionNumber,
            });
        }

        return Result.Success(listOfLevels);
    }
}