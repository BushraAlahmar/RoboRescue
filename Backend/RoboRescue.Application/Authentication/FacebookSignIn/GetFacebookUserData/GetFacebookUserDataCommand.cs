using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;

namespace RoboRescue.Application.Authentication.FacebookSignIn.GetFacebookUserData;

public sealed record GetFacebookUserDataCommand(string Code) : ICommand<RefreshTokenResponse>;