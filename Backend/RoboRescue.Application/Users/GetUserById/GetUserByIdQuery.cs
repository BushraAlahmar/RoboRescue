using RoboRescue.Application.Abstractions.Messaging;
using RoboRescue.Application.Users.Dtos;

namespace RoboRescue.Application.Users.GetUserById;

public record GetUserByIdQuery(Guid UserId) : IQuery<UserResponse>;