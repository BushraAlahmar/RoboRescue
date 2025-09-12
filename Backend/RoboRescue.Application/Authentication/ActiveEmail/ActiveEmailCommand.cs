using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Authentication.ActiveEmail;

public sealed record ActiveEmailCommand(string Email, string Token) : ICommand<bool>;