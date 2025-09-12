using MediatR;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.Analyzers.CheckCode;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/checkCode")]
public class CheckCodeController(ISender sender) : ControllerBase
{
    [HttpPost("checkCode")]
    public async Task<ActionResult<List<string>>> CheckCode(
        [FromBody] CheckCodeCommand checkCodeCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(checkCodeCommand, cancellationToken);
        if (result.Value is not null && result.Value.Count > 0)
        {
            return BadRequest(result.Value);
        }

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}