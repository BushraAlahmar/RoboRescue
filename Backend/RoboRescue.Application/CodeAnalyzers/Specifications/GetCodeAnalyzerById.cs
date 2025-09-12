using Ardalis.Specification;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Application.CodeAnalyzers.Specifications;

internal sealed class GetCodeAnalyzerById : Specification<CodeAnalyzer>
{
    public GetCodeAnalyzerById(Guid codeAnalyzerId)
    {
        Query.Where(c => c.Id == codeAnalyzerId);
    }
}