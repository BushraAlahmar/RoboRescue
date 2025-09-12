using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Passwords.ResetPasswordWithToken;

public record ResetPasswordWithTokenCommand(string Email, string Token, string NewPassword) : ICommand<bool>;