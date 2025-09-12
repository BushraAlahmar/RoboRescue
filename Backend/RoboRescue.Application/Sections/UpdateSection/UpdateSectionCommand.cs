using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Sections.Dtos;

namespace RoboRescue.Application.Sections.UpdateSection;

public sealed class UpdateSectionCommand : SectionRequest, ICommand<bool>
{
    public Guid SectionId { get; set; }
}