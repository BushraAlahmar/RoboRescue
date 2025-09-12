using MediatR;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.Authentication.ActiveEmail;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Application.Authentication.RefreshTokens;
using RoboRescue.Application.Authentication.SignIn;
using RoboRescue.Application.Authentication.SignUp;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/authentication")]
public sealed class AuthenticationController(ISender sender) : ControllerBase
{
    [HttpPost("signin")]
    public async Task<ActionResult<RefreshTokenResponse>> SignIn([FromBody] SignInCommand signInCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(signInCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("signup")]
    public async Task<ActionResult<RefreshTokenResponse>> SignUp([FromBody] SignUpCommand signUpCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(signUpCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("activeEmail")]
    public async Task<ActionResult<RefreshTokenResponse>> ActiveEmail(
        [FromBody] ActiveEmailCommand activeEmailCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(activeEmailCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("refreshToken")]
    public async Task<ActionResult<RefreshTokenResponse>> RefreshToken(
        [FromBody] RefreshTokenCommand refreshTokenCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(refreshTokenCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}