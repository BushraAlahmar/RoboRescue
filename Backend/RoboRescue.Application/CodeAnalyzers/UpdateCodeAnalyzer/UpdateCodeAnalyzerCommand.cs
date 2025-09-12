using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.CodeAnalyzers.Dtos;

namespace RoboRescue.Application.CodeAnalyzers.UpdateCodeAnalyzer;

public sealed class UpdateCodeAnalyzerCommand : CodeAnalyzerRequest, ICommand<bool>
{
    public Guid CodeAnalyzerId { get; set; }
}