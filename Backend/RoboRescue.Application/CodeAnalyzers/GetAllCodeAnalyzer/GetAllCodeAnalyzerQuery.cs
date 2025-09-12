using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.CodeAnalyzers.Dtos;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Application.CodeAnalyzers.GetAllCodeAnalyzer;

public class GetAllCodeAnalyzerQuery : PaginatedRequest<CodeAnalyzer, CodeAnalyzerResponse>,
    IQuery<PaginatedList<CodeAnalyzerResponse>>;