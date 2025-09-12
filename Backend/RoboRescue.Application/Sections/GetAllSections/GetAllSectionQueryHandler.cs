using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Sections.Dtos;
using RoboRescue.Application.Sections.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Application.Sections.GetAllSections;

internal class GetAllSectionQueryHandler(IRepository<Section> repository)
    : IQueryHandler<GetAllSectionQuery, PaginatedList<SectionResponse>>
{
    public async Task<Result<PaginatedList<SectionResponse>>> Handle(GetAllSectionQuery request,
        CancellationToken cancellationToken)
    {
        request.Spec(new GetAllSectionsPaginated(request.StartDate, request.EndDate, request.Keyword));
        var sections = await repository.GetSpecifiedPaginatedList(request, cancellationToken);
        return sections;
    }
}