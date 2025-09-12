using Ardalis.Specification;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Application.Sections.Specifications;

internal sealed class GetSectionById : Specification<Section>
{
    public GetSectionById(Guid sectionId)
    {
        Query.Where(s => s.Id == sectionId);
    }
}