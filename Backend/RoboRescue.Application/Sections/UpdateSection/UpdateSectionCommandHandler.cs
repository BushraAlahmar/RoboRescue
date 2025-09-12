using RoboRescue.Application.Abstractions;
using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Sections.Specifications;
using RoboRescue.Domain.Abstractions;
using RoboRescue.Domain.Sections;

namespace RoboRescue.Application.Sections.UpdateSection;

internal class UpdateSectionCommandHandler(
    IRepository<Section> repository,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateSectionCommand, bool>
{
    public async Task<Result<bool>> Handle(UpdateSectionCommand request, CancellationToken cancellationToken)
    {
        var section = await repository.FirstOrDefaultAsync(new GetSectionById(request.SectionId), cancellationToken);
        if (section is null)
        {
            return Result.Failure<bool>(Error.IncorrectCredentials);
        }

        var sectionResult =
            await repository.FirstOrDefaultAsync(new GetSectionByNumber(request.SectionNumber, section.Id),
                cancellationToken);
        if (sectionResult is not null)
        {
            return Result.Failure<bool>(Error.NumberIsExist);
        }

        section.Update(request.Name, request.EnName, request.SectionNumber, request.Description, request.EnDescription);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}