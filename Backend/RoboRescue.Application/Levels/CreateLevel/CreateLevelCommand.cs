using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Levels.CreateLevel;

public sealed record CreateLevelCommand(
    string Name,
    string EnName,
    int LevelNumber,
    Guid SectionId,
    Guid CodeAnalyzerId,
    string Description,
    string EnDescription,
    string Task,
    string EnTask,
    string SuccessMessage,
    string EnSuccessMessage,
    Guid? DependentOnLevelId) : ICommand<Guid>;