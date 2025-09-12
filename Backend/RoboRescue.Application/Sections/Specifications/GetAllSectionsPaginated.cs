using Ardalis.Specification;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Application.Sections.Specifications;

internal sealed class GetAllSectionsPaginated : Specification<Section>
{
    public GetAllSectionsPaginated(DateTimeOffset? startDate, DateTimeOffset? endDate, string? keyword)
    {
        Query.Where(c => startDate == null || c.CreatedAt >= startDate)
            .Where(c => endDate == null || c.CreatedAt <= endDate)
            .Where(c => keyword == null || c.Description.Contains(keyword));
    }
}