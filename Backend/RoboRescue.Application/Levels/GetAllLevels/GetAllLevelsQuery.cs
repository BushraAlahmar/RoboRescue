using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Levels.Dtos;
using RoboRescue.Domain.Levels;

namespace RoboRescue.Application.Levels.GetAllLevels;

public sealed class GetAllLevelsQuery
    : PaginatedRequest<Level, LevelResponse>, IQuery<PaginatedList<LevelResponse>>
{
    public Guid? SectionId { get; set; }
    public int? LevelNumber { get; set; }
    public string Lang { get; set; } = null!;
}