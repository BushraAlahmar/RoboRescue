using Ardalis.Specification;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Application.Sections.Specifications;

internal sealed class GetSectionByNumber : Specification<Section>
{
    public GetSectionByNumber(int sectionNumber, Guid? sectionId)
    {
        Query.Where(s => s.SectionNumber == sectionNumber).Where(s => !sectionId.HasValue || s.Id != sectionId);
    }
}