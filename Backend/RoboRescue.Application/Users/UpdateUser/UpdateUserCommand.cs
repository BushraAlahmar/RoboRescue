using RoboRescue.Application.Abstractions.Messaging;

namespace RoboRescue.Application.Users.UpdateUser;

public sealed record UpdateUserCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    DateTimeOffset BirthDate,
    string UserName,
    string Email,
    string FcmToken) : ICommand<bool>;