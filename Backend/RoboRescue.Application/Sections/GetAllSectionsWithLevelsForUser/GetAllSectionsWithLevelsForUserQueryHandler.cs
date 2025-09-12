using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Specifications;
using RoboRescue.Application.Sections.Dtos;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Sections;
using RoboRescue.Domain.UserLevels;

namespace RoboRescue.Application.Sections.GetAllSectionsWithLevelsForUser;

public class GetAllSectionsWithLevelsForUserQueryHandler(
    IRepository<UserLevel> userLevelsRepository,
    IRepository<Section> sectionsRepository)
    : IQueryHandler<GetAllSectionsWithLevelsForUserQuery, List<SectionsResponse>>
{
    public async Task<Result<List<SectionsResponse>>> Handle(GetAllSectionsWithLevelsForUserQuery request,
        CancellationToken cancellationToken)
    {
        var userLevels = await userLevelsRepository.GetAllWithRelated(new GetUserLevelByUserId(request.UserId),
            cancellationToken, level => level.Level, level => level.Level.Section);
        if (userLevels is null)
        {
            return Result.Failure<List<SectionsResponse>>(Error.IncorrectCredentials);
        }

        var sections = userLevels.GroupBy(u => u.Level.SectionId).Select(u => new
        {
            sectionId = u.Key,
            Data = u.ToList()
        }).ToList();
        var databaseSections = sectionsRepository.GetQuery().ToList();
        var sectionsResponses = new List<SectionsResponse>();
        foreach (var section in sections)
        {
            var sectionsResponse = new SectionsResponse
            {
                Id = section.sectionId,
                Name = request.Lang.Trim().ToLower().Equals("de")
                    ? section.Data.First().Level.Section.Name
                    : section.Data.First().Level.EnName,
                Description = request.Lang.Trim().ToLower().Equals("de")
                    ? section.Data.First().Level.Section.Description
                    : section.Data.First().Level.Section.EnDescription,
                CreatedAt = section.Data.First().Level.Section.CreatedAt,
                UpdatedAt = section.Data.First().Level.Section.UpdatedAt,
                SectionNumber = section.Data.First().Level.Section.SectionNumber,
                UserLastLevelFinishNumber = section.Data.OrderBy(u => u.Level.LevelNumber).Last().Level.LevelNumber
            };
            databaseSections.Remove(databaseSections.First(s => s.Id == section.sectionId));
            foreach (var userLevel in section.Data)
            {
                var dependentOnLevelId = userLevel.Level.DependentOnLevelId;
                var code = section.Data.FirstOrDefault(l => l.LevelId == dependentOnLevelId)?.Code;
                sectionsResponse.Levels.Add(new LevelResponseForSection
                {
                    Id = userLevel.LevelId,
                    LevelNumber = userLevel.Level.LevelNumber,
                    Name = request.Lang.Trim().ToLower().Equals("de") ? userLevel.Level.Name : userLevel.Level.EnName,
                    Description = request.Lang.Trim().ToLower().Equals("de")
                        ? userLevel.Level.Description
                        : userLevel.Level.EnDescription,
                    SuccessMessage = request.Lang.Trim().ToLower().Equals("de")
                        ? userLevel.Level.SuccessMessage
                        : userLevel.Level.EnSuccessMessage,
                    Task = request.Lang.Trim().ToLower().Equals("de") ? userLevel.Level.Task : userLevel.Level.EnTask,
                    DependOnCode = code
                });
            }

            sectionsResponses.Add(sectionsResponse);
        }

        if (databaseSections.Count > 0)
        {
            sectionsResponses.AddRange(databaseSections.Select(section => new SectionsResponse
            {
                Id = section.Id,
                Name = request.Lang.Trim().ToLower().Equals("de") ? section.Name : section.EnName,
                Description = request.Lang.Trim().ToLower().Equals("de") ? section.Description : section.EnDescription,
                CreatedAt = section.CreatedAt,
                UpdatedAt = section.UpdatedAt,
                SectionNumber = section.SectionNumber,
                UserLastLevelFinishNumber = 0
            }));
        }

        return Result.Success(sectionsResponses);
    }
}