using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Dtos;

namespace RoboRescue.Application.Levels.GetLevelByLevelId;

public record GetLevelByLevelIdQuery(Guid LevelId, string Lang) : IQuery<LevelResponse>;