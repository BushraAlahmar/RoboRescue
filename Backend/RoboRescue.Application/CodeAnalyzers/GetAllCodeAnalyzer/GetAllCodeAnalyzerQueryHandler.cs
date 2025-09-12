using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.CodeAnalyzers.Dtos;
using RoboRescue.Application.CodeAnalyzers.Specifications;
using RoboRescue.Application.Sections.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.CodeAnalyzers;

namespace RoboRescue.Application.CodeAnalyzers.GetAllCodeAnalyzer;

public class GetAllCodeAnalyzerQueryHandler(IRepository<CodeAnalyzer> repository)
    : IQueryHandler<GetAllCodeAnalyzerQuery, PaginatedList<CodeAnalyzerResponse>>
{
    public async Task<Result<PaginatedList<CodeAnalyzerResponse>>> Handle(GetAllCodeAnalyzerQuery request,
        CancellationToken cancellationToken)
    {
        request.Spec(new GetAllCodeAnalyzersPaginated(request.StartDate, request.EndDate, request.Keyword));
        var codeAnalyzers = await repository.GetSpecifiedPaginatedList(request, cancellationToken);
        return codeAnalyzers;
    }
}