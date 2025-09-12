using RoboRescue.Domain.RefreshTokens;
using RoboRescue.Domain.Users;

namespace RoboRescue.Application.Abstractions.JWT;

public interface IGenerateRefreshToken
{
    RefreshToken GRefreshToken(string refreshToken, User user);
    string HashRefreshToken(string refreshToken);
}