using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RoboRescue.Application.Abstractions.JWT;
using RoboRescue.Application.Options;

namespace RoboRescue.Infrastructure.JWT;

public class JwtExtractor(IOptionsSnapshot<JwtOptions> jwtOptions) : IJwtExtractor
{
        public List<Claim>? Extract(HttpContext httpContext)
        {
            if (!httpContext.Request.Headers.ContainsKey("Authorization"))
            {
                return null;
            }


            string? token = httpContext.Request.Headers["Authorization"];


            if (string.IsNullOrWhiteSpace(token))
                return null;
            var validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtOptions.Value.Key)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateActor = false,

                ValidAlgorithms = new string[] { SecurityAlgorithms.HmacSha512 },

            };

            if (ValidateToken(token, validations))
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(token);
                var claims = jwtSecurityToken.Claims.ToList();
                return claims;
            }

            return null;
        }



        public List<Claim>? Extract(string token)
        {
            var validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtOptions.Value.Key)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateActor = false,

                ValidAlgorithms = new string[] { SecurityAlgorithms.HmacSha512 },

            };

            if (ValidateToken(token, validations))
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(token);
                var claims = jwtSecurityToken.Claims.ToList();
                return claims;
            }

            return null;
        }


        private static bool ValidateToken(string token, TokenValidationParameters tvp)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                SecurityToken securityToken;
                ClaimsPrincipal principal = handler.ValidateToken(token, tvp, out securityToken);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
