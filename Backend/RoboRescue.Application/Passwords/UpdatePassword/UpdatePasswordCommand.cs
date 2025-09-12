using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Passwords.UpdatePassword;

public record UpdatePasswordCommand(Guid UserId, string OldPassword, string NewPassword) : ICommand<bool>;