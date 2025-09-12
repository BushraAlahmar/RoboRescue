using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace RoboRescue.Application.Abstractions.JWT;

public interface IJwtExtractor
{
    List<Claim>? Extract(HttpContext httpContext);
    List<Claim>? Extract(string token);
}