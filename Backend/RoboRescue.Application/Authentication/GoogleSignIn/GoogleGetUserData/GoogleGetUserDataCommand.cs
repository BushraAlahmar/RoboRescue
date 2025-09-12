using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;

namespace RoboRescue.Application.Authentication.GoogleSignIn.GoogleGetUserData;

public sealed record GoogleGetUserDataCommand(string Code) : ICommand<RefreshTokenResponse>;