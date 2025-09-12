using Ardalis.Specification;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Application.CodeAnalyzers.Specifications;

internal sealed class GetAllCodeAnalyzersPaginated : Specification<CodeAnalyzer>
{
    public GetAllCodeAnalyzersPaginated(DateTimeOffset? startDate, DateTimeOffset? endDate, string? keyword)
    {
        Query.Where(c => startDate == null || c.CreatedAt >= startDate)
            .Where(c => endDate == null || c.CreatedAt <= endDate);
    }
}