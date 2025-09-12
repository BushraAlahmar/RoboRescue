using MediatR;
using Microsoft.AspNetCore.Mvc;
using RoboRescue.Application.Abstractions.ExternalProviders;
using RoboRescue.Application.Authentication.Dtos;
using RoboRescue.Application.Authentication.FacebookSignIn.GetFacebookUserData;
using RoboRescue.Application.Authentication.GoogleSignIn.GoogleGetUserData;

namespace RoboRescue.Api.Controllers;

[ApiController]
[Route("api/externalProviders")]
public class ExternalProvidersController(ISender sender, IConfiguration configuration) : ControllerBase
{
    // [HttpGet("FacebookSignInUrl")]
    // public async Task<ActionResult<string?>> FacebookSignInUrl(
    //     CancellationToken cancellationToken)
    // {
    //     var facebookAuthProvider = new FacebookAuthProvider(null
    //         , configuration["Authentication:Facebook:AppId"]!
    //         , configuration["Authentication:Facebook:AppSecret"]!
    //     );
    //     var loginUrl = facebookAuthProvider.GenerateLoginUrl(new List<string>());
    //     return Ok(loginUrl);
    // }
    //
    // [HttpGet("FacebookUserAccountData")]
    // public async Task<ActionResult<RefreshTokenResponse>> FacebookUserAccountData(
    //     [FromQuery] GetFacebookUserDataCommand getFacebookUserDataCommand,
    //     CancellationToken cancellationToken)
    // {
    //     var result = await sender.Send(getFacebookUserDataCommand, cancellationToken);
    //     return Ok(result.Value);
    // }

    [HttpGet("GoogleSignInUrl")]
    public async Task<ActionResult<string?>> GoogleSignInUrl(
        CancellationToken cancellationToken)
    {
        var scopes = new List<string>()
        {
            "https://www.googleapis.com/auth/user.birthday.read",
            "https://www.googleapis.com/auth/user.gender.read",
            "https://www.googleapis.com/auth/user.phonenumbers.read"
        };
        var google = new GoogleAuthProvider(null,
            configuration["Authentication:Google:ClientId"]!,
            configuration["Authentication:Google:ClientSecret"]!
        );
        var loginUrl = google.GenerateLoginUrl(null);
        return loginUrl ?? null;
    }

    [HttpGet("GoogleUserAccountData")]
    public async Task<ActionResult<RefreshTokenResponse>> GoogleUserAccountData(
        [FromQuery] GoogleGetUserDataCommand googleGetUserDataCommand,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(googleGetUserDataCommand, cancellationToken);
        return Ok(result.Value);
    }
}