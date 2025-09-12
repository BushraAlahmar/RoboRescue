using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;

namespace RoboRescue.Application.Authentication.SignIn;

public sealed record SignInCommand() : SignInRequest, ICommand<RefreshTokenResponse>;