using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RoboRescue.Application.Abstractions.JWT;
using RoboRescue.Application.Options;
using RoboRescue.Domain.Users;

namespace RoboRescue.Infrastructure.JWT;

public class JwtGenerator(IOptionsSnapshot<JwtOptions> jwtOptions) : IJWTGenerator
{
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;

    public string Generate(User user, Guid id)
    {
        var key = Encoding.UTF8.GetBytes(_jwtOptions.Key);
        List<Claim> claims =
        [
            new Claim("Id", user.Id.ToString()),
            new Claim("Username", user.UserName),
            new Claim("Name", user.FirstName + " " + user.LastName),
            new Claim("RefreshTokenId", id.ToString()),
            new Claim("Email", user.Email)
        ];

        var expiresAt = _jwtOptions.AccessTokenLifetime;

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenLifetime),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512)
        );


        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}