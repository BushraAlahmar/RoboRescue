using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.UserSections.CreateUserSection;

public sealed record CreateUserSectionCommand(Guid UserId, Guid LevelId, string Code) : ICommand<Guid>;