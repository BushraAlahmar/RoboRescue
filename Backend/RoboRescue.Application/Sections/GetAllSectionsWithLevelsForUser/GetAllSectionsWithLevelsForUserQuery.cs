using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Sections.Dtos;

namespace RoboRescue.Application.Sections.GetAllSectionsWithLevelsForUser;

public record GetAllSectionsWithLevelsForUserQuery(Guid UserId, string Lang) : IQuery<List<SectionsResponse>>;