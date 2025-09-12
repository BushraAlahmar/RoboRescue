using MediatR;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.CodeAnalyzers.CreateCodeAnalyzer;
using RoboRescue.Application.CodeAnalyzers.GetAllCodeAnalyzer;
using RoboRescue.Application.CodeAnalyzers.UpdateCodeAnalyzer;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/codeAnalyzer")]
public class CodeAnalyzerController(ISender sender) : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<bool>> CreateCodeAnalyzer(
        [FromBody] CreateCodeAnalyzerCommand createCodeAnalyzerCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(createCodeAnalyzerCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("update")]
    public async Task<ActionResult<bool>> UpdateCodeAnalyzer(
        [FromBody] UpdateCodeAnalyzerCommand updateCodeAnalyzerCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(updateCodeAnalyzerCommand, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("getAll")]
    public async Task<ActionResult<bool>> GetAllCodeAnalyzers(
        [FromQuery] GetAllCodeAnalyzerQuery getAllCodeAnalyzerQuery,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(getAllCodeAnalyzerQuery, cancellationToken);
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}