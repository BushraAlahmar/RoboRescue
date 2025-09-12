using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Domain.RefreshTokens;

namespace RoboRescue.Application.Authentication.SignUp;

public sealed class SignUpCommand : SignUpRequest, ICommand<bool>;