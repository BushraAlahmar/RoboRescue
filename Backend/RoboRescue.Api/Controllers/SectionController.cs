using MediatR;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.Sections.CreateSection;
using RoboRescue.Application.Sections.GetAllSections;
using RoboRescue.Application.Sections.GetAllSectionsWithLevelsForUser;
using RoboRescue.Application.Sections.ReplaySection;
using RoboRescue.Application.Sections.UpdateSection;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/section")]
public class SectionController(ISender sender) : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<bool>> CreateSection([FromBody] CreateSectionCommand createSectionCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(createSectionCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("update")]
    public async Task<ActionResult<bool>> UpdateSection([FromBody] UpdateSectionCommand updateSectionCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(updateSectionCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getAll")]
    public async Task<ActionResult<bool>> GetAllSections(
        [FromQuery] GetAllSectionQuery getAllSectionQuery,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(getAllSectionQuery, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getAllForMap")]
    public async Task<ActionResult<bool>> GetAllSectionsForMap(
        [FromQuery] GetAllSectionsWithLevelsForUserQuery allSectionsWithLevelsForUserQuery,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(allSectionsWithLevelsForUserQuery, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("replaySection")]
    public async Task<ActionResult<bool>> ReplaySection(
        [FromQuery] ReplaySectionCommand replaySectionCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(replaySectionCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}