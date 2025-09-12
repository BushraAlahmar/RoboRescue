using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Sections.Dtos;

namespace RoboRescue.Application.Sections.CreateSection;

public sealed class CreateSectionCommand : SectionRequest, ICommand<Guid>;