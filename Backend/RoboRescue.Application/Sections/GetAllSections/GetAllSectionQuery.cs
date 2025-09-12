using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Sections.Dtos;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Application.Sections.GetAllSections;

public class GetAllSectionQuery() : PaginatedRequest<Section, SectionResponse>, IQuery<PaginatedList<SectionResponse>>
{
    
    public string Lang { get; set; } = null!;
}