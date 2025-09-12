using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Sections.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Application.Sections.CreateSection;

internal class CreateSectionCommandHandler(
    IRepository<Section> repository,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateSectionCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateSectionCommand request, CancellationToken cancellationToken)
    {
        var sectionResult =
            await repository.FirstOrDefaultAsync(new GetSectionByNumber(request.SectionNumber, null),
                cancellationToken);
        if (sectionResult is not null)
        {
            return Result.Failure<Guid>(Error.NumberIsExist);
        }

        var section = Section.Create(request.Name, request.EnName, request.SectionNumber, request.Description,
            request.EnDescription);
        await repository.Add(section, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(section.Id);
    }
}