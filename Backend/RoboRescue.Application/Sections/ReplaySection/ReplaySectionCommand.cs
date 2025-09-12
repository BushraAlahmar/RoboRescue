using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Sections.ReplaySection;

public record ReplaySectionCommand(Guid SectionId, Guid UserId) : ICommand<bool>;