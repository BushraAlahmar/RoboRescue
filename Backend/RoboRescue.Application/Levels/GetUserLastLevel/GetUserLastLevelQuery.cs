using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Dtos;

namespace RoboRescue.Application.Levels.GetUserLastLevel;

public sealed record GetUserLastLevelQuery(Guid UserId, string Lang) : IQuery<List<LevelResponse>>;