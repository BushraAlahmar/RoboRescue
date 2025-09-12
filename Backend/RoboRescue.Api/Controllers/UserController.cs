using MediatR;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.Users.GetUserById;
using RoboRescue.Application.Users.UpdateUser;
using RoboRescue.Domain.Users;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController(ISender sender) : ControllerBase
{
    [HttpPost("update")]
    public async Task<ActionResult<bool>> UpdateUser([FromBody] UpdateUserCommand updateUserCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(updateUserCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getUserById/{userId}")]
    public async Task<ActionResult<User>> GetUserById(Guid userId, CancellationToken cancellationToken)
    {
        var getUserByIdQuery = new GetUserByIdQuery(userId);
        var user = await sender.Send(getUserByIdQuery, cancellationToken);
        if (user.IsFailure)
        {
            return BadRequest(user.Error);
        }

        return Ok(user.Value);
    }
}