using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using RoboRescue.Application.Abstractions.JWT;
using RoboRescue.Application.Options;
using RoboRescue.Domain.RefreshTokens;
using RoboRescue.Domain.Users;

namespace RoboRescue.Infrastructure.JWT;

public class GenerateRefreshToken(IOptionsSnapshot<JwtOptions> jwtOptions) : IGenerateRefreshToken
{
    public RefreshToken GRefreshToken(string refreshToken, User user)
    {
        return
            RefreshToken.Create(HashRefreshToken(refreshToken),
                DateTimeOffset.Now.AddMinutes(jwtOptions.Value.RefreshTokenLifetime),
                user.GenerateSecurityHash(), user.Id);
    }

    public string HashRefreshToken(string refreshToken)
    {
        var sha512 = SHA512.Create();
        var bits = sha512.ComputeHash(Encoding.UTF8.GetBytes(refreshToken));
        var builder = new StringBuilder();
        foreach (var t in bits)
        {
            builder.Append(t.ToString("x2"));
        }

        return builder.ToString();
    }
}