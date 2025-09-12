using MediatR;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.Passwords.AskToResetPassword;
using RoboRescue.Application.Passwords.ResetPasswordWithToken;
using RoboRescue.Application.Passwords.UpdatePassword;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/password")]
public class PasswordController(ISender sender) : ControllerBase
{
    [HttpPost("askForPasswordToken")]
    public async Task<ActionResult<bool>> AskToResetPassword(
        [FromBody] AskToResetPasswordCommand askToResetPasswordCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(askToResetPasswordCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("resetPassword")]
    public async Task<ActionResult<bool>> ResetPassword(
        [FromBody] ResetPasswordWithTokenCommand resetPasswordWithTokenCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(resetPasswordWithTokenCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("updatePassword")]
    public async Task<ActionResult<bool>> UpdatePassword(
        [FromBody] UpdatePasswordCommand passwordCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(passwordCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}