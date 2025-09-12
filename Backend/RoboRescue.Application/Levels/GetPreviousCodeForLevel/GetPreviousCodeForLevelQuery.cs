using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Levels.GetPreviousCodeForLevel;

public sealed record GetPreviousCodeForLevelQuery(Guid LevelId, Guid UserId) : IQuery<string>;