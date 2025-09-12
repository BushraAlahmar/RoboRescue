using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Passwords.AskToResetPassword;

public record AskToResetPasswordCommand(string Email) : ICommand<bool>;