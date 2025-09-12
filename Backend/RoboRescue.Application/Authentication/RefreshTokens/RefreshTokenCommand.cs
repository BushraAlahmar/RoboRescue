using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;

namespace RoboRescue.Application.Authentication.RefreshTokens;

public sealed record RefreshTokenCommand() : RefreshTokenRequest, ICommand<RefreshTokenResponse>;