using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.CodeAnalyzers.Dtos;

namespace RoboRescue.Application.CodeAnalyzers.CreateCodeAnalyzer;

public sealed class CreateCodeAnalyzerCommand : CodeAnalyzerRequest, ICommand<Guid>;