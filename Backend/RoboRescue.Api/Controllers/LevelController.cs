using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.Levels.CreateLevel;
using RoboRescue.Application.Levels.Dtos;
using RoboRescue.Application.Levels.GetAllLevels;
using RoboRescue.Application.Levels.GetLevelByLevelId;
using RoboRescue.Application.Levels.GetPreviousCodeForLevel;
using RoboRescue.Application.Levels.GetUserLastLevel;
using RoboRescue.Application.Levels.UpdateLevel;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/level")]
public class LevelController(ISender sender) : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<bool>> CreateLevel([FromBody] CreateLevelCommand createLevelCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(createLevelCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("update")]
    public async Task<ActionResult<bool>> UpdateLevel([FromBody] UpdateLevelCommand updateLevelCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(updateLevelCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getAll")]
    public async Task<ActionResult<bool>> GetAllLevels(
        [FromQuery] GetAllLevelsQuery getAllLevelsQuery,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(getAllLevelsQuery, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getLevelById")]
    public async Task<ActionResult<bool>> GetLevelById(
        [FromQuery] GetLevelByLevelIdQuery getLevelByLevelIdQuery,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(getLevelByLevelIdQuery, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getUserLastLevels")]
    public async Task<ActionResult<List<LevelResponse>>> GetUserLastLevels(
        [FromQuery] GetUserLastLevelQuery getUserLastLevelQuery,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(getUserLastLevelQuery, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getPreviousCodeForLevel")]
    public async Task<ActionResult<string>> GetPreviousCodeForLevel(
        [FromQuery] GetPreviousCodeForLevelQuery getPreviousCodeForLevelQuery, CancellationToken cancellationToken)
    {
        var code = await sender.Send(getPreviousCodeForLevelQuery, cancellationToken);
        if (code.IsFailure)
        {
            return BadRequest(code.Error);
        }

        return Ok(code.Value);
    }
}