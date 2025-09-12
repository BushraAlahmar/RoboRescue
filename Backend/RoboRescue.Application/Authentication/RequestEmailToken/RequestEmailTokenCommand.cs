using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Authentication.RequestEmailToken;

public sealed record RequestEmailTokenCommand(string Email) : ICommand<bool>;