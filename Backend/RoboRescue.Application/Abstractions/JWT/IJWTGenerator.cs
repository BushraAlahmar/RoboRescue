using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Abstractions.JWT;

public interface IJWTGenerator
{
    string Generate(User user, Guid id);
}