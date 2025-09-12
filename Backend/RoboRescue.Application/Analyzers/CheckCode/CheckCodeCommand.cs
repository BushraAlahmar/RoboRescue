using RoboRescue.Application.Abstractions.JavaCodeAnalyzer;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Analyzers.Dtos;

namespace RoboRescue.Application.Analyzers.CheckCode;

public record CheckCodeCommand(Guid UserId, Guid LevelId, string Code, string Lang) : ICommand<List<string>>;